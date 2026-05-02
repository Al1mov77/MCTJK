'use client'

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string | null, text: string, roomId?: string) {
    // If it's the VIP room, ensure sender is VIP
    if (roomId === 'VIP_MEMBERS') {
      const user = await this.prisma.user.findUnique({ where: { id: senderId } });
      if (!user?.isVip) throw new Error('VIP access required');
    }

    return this.prisma.message.create({
      data: {
        senderId,
        receiverId: roomId ? null : receiverId,
        roomId,
        text,
      },
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true, role: true, isVip: true }
        }
      }
    });
  }

  async getMessages(userId: string, otherId: string) {
    return this.prisma.message.findMany({
      where: {
        roomId: null,
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true, role: true, isVip: true }
        }
      }
    });
  }

  async getRoomMessages(roomId: string) {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true, role: true, isVip: true }
        }
      }
    });
  }

  async getConversations(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    const sent = await this.prisma.message.findMany({
      where: { senderId: userId, roomId: null },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const received = await this.prisma.message.findMany({
      where: { receiverId: userId, roomId: null },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const userIds = Array.from(new Set([
      ...sent.map(m => m.receiverId).filter(Boolean),
      ...received.map(m => m.senderId).filter(Boolean)
    ]));

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds as string[] } },
      select: { id: true, email: true, name: true, avatar: true, role: true, isVip: true }
    });

    return users;
  }
}
