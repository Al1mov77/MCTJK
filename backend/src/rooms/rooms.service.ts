import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  private parseRoom(room: any) {
    if (!room) return null;
    return {
      ...room,
      images: room.images ? JSON.parse(room.images) : [],
    };
  }

  async findAll(hotelId: string) {
    const rooms = await this.prisma.room.findMany({
      where: { hotelId },
    });
    return rooms.map(r => this.parseRoom(r));
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { hotel: true },
    });
    if (!room) throw new NotFoundException(`Room with ID ${id} not found`);
    return this.parseRoom(room);
  }

  async create(dto: CreateRoomDto) {
    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);

    const room = await this.prisma.room.create({
      data,
    });
    return this.parseRoom(room);
  }

  async update(id: string, dto: UpdateRoomDto) {
    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);

    const room = await this.prisma.room.update({
      where: { id },
      data,
    });
    return this.parseRoom(room);
  }

  async remove(id: string) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}
