import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService
  ) {}

  private async sendBotMessage(userId: string, text: string) {
    // Find first admin to act as bot, or use a system-like logic
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (admin) {
      await this.chatService.saveMessage(admin.id, userId, text);
    } else {
      console.warn('System: No ADMIN found to send bot messages.');
    }
  }

  async create(userId: string, dto: CreateBookingDto) {
    const { roomId, startDate, endDate } = dto;

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true }
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check availability
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        roomId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            startDate: { lte: new Date(startDate) },
            endDate: { gte: new Date(startDate) },
          },
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(endDate) },
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      throw new BadRequestException('Room is not available for selected dates');
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'PENDING',
      },
    });

    await this.sendBotMessage(userId, `🛎 New Booking Request for ${room.hotel.title}. Status: PENDING. Our team will review it shortly.`);

    return booking;
  }

  async findAllByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, isVip: true, role: true } },
        room: {
          include: { hotel: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, isVip: true, role: true } },
        room: {
          include: { hotel: true },
        },
      },
    });
  }

  async updateStatus(id: string, status: 'CONFIRMED' | 'CANCELLED', reason?: string) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { room: { include: { hotel: true } } }
    });

    let message = '';
    if (status === 'CONFIRMED') {
      message = `✨ Ваша бронь в "${booking.room.hotel.title}" ПРИНЯТА ГЛОБАЛЬНО! ✅`;
      if (reason) {
        message += `\n\n💬 Сообщение от администратора: ${reason}`;
      } else {
        message += `\n\nЖелаем вам приятного пребывания в нашем отеле. Наслаждайтесь первоклассным сервисом!`;
      }
    } else {
      message = `❌ Ваша бронь в "${booking.room.hotel.title}" ОТКЛОНЕНА.`;
      if (reason) {
        message += `\n\n📝 Причина: ${reason}`;
      } else {
        message += `\n\nК сожалению, мы не можем подтвердить ваше бронирование в данный момент.`;
      }
    }
    
    await this.sendBotMessage(booking.userId, message);

    return booking;
  }
}
