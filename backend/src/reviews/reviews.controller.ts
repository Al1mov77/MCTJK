import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':hotelId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a review/rating to a hotel (1-5 stars). Updates hotel rating globally.' })
  @ApiBody({ schema: { type: 'object', properties: { rating: { type: 'number', example: 5 }, comment: { type: 'string', example: 'Amazing stay!' } } } })
  create(
    @Req() req: any,
    @Param('hotelId') hotelId: string,
    @Body() dto: { rating: number; comment: string },
  ) {
    return this.reviewsService.create(req.user.id, hotelId, dto.rating, dto.comment);
  }

  @Get('hotel/:hotelId')
  @ApiOperation({ summary: 'Get all reviews for a hotel' })
  findByHotel(@Param('hotelId') hotelId: string) {
    return this.reviewsService.findByHotel(hotelId);
  }

  @Get('hotel/:hotelId/stats')
  @ApiOperation({ summary: 'Get rating statistics for a hotel (average, count, distribution)' })
  async getStats(@Param('hotelId') hotelId: string) {
    return this.reviewsService.getStats(hotelId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own review' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.reviewsService.remove(req.user.id, id);
  }
}
