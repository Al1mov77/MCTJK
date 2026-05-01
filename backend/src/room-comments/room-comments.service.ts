import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomCommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, roomId: string, text: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');

    return this.prisma.roomComment.create({
      data: {
        userId,
        roomId,
        text,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            isVip: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.roomComment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            isVip: true,
          },
        },
        room: {
          include: {
            hotel: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRoom(roomId: string) {
    return this.prisma.roomComment.findMany({
      where: { roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            isVip: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, userRole: string, commentId: string) {
    const comment = await this.prisma.roomComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    // Admin can delete any comment, users can only delete their own
    if (userRole !== 'ADMIN' && comment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    return this.prisma.roomComment.delete({
      where: { id: commentId },
    });
  }
}
