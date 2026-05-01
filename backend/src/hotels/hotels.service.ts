import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelDto, UpdateHotelDto, HotelQueryDto } from './dto/hotel.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  private parseHotel(hotel: any) {
    if (!hotel) return null;
    return {
      ...hotel,
      images: hotel.images ? JSON.parse(hotel.images) : [],
      skills: hotel.skills ? JSON.parse(hotel.skills) : [],
      rooms: hotel.rooms?.map((r: any) => ({
        ...r,
        images: r.images ? JSON.parse(r.images) : [],
      }))
    };
  }

  async findAll(query: HotelQueryDto) {
    const { city, minRating } = query;

    const hotels = await this.prisma.hotel.findMany({
      where: {
        city: city ? { contains: city } : undefined,
        rating: minRating ? { gte: parseFloat(minRating) } : undefined,
      },
      include: {
        rooms: true,
      }
    });

    return hotels.map(h => this.parseHotel(h));
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            bookings: true
          }
        },
        reviews: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }

    return this.parseHotel(hotel);
  }

  async create(dto: CreateHotelDto) {
    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);
    if (dto.skills) data.skills = JSON.stringify(dto.skills);

    const hotel = await this.prisma.hotel.create({
      data,
    });
    return this.parseHotel(hotel);
  }

  async update(id: string, dto: UpdateHotelDto) {
    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);
    if (dto.skills) data.skills = JSON.stringify(dto.skills);

    const hotel = await this.prisma.hotel.update({
      where: { id },
      data,
    });
    return this.parseHotel(hotel);
  }

  async remove(id: string) {
    return this.prisma.hotel.delete({
      where: { id },
    });
  }

  async getUniqueSkills() {
    const hotels = await this.prisma.hotel.findMany({
      select: { skills: true },
    });
    
    const allSkills = hotels.flatMap(h => h.skills ? JSON.parse(h.skills) : []);
    return [...new Set(allSkills)];
  }
}
