import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, hotelId: string, rating: number, comment: string) {
    const review = await this.prisma.review.create({
      data: { userId, hotelId, rating, comment },
      include: { user: { select: { id: true, name: true, avatar: true, role: true, isVip: true } } },
    });

    // Update hotel average rating globally
    await this.recalculateHotelRating(hotelId);
    return review;
  }

  async findByHotel(hotelId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { hotelId },
      include: { user: { select: { id: true, name: true, avatar: true, role: true, isVip: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews;
  }

  async getStats(hotelId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { hotelId },
      select: { rating: true },
    });

    if (reviews.length === 0) return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    for (const r of reviews) {
      sum += r.rating;
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    }

    return {
      average: parseFloat((sum / reviews.length).toFixed(1)),
      count: reviews.length,
      distribution,
    };
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId) throw new ForbiddenException('Cannot delete other users review');

    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.recalculateHotelRating(review.hotelId);
    return { deleted: true };
  }

  private async recalculateHotelRating(hotelId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { hotelId },
      select: { rating: true },
    });

    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await this.prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: parseFloat(avg.toFixed(1)) },
    });
  }
}
