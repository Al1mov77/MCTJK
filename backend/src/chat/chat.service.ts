import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, text: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true, role: true }
        }
      }
    });
  }

  async getMessages(userId: string, otherId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, email: true, name: true, avatar: true, role: true }
        }
      }
    });
  }

  async getConversations(userId: string) {
    // This is a simplified version to get unique chat partners
    const sent = await this.prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const received = await this.prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const userIds = Array.from(new Set([
      ...sent.map(m => m.receiverId),
      ...received.map(m => m.senderId)
    ]));

    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, name: true, avatar: true, role: true }
    });
  }
}
