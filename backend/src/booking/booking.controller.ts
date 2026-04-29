import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Booking')
@Controller('booking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user bookings' })
  findAll(@Req() req) {
    return this.bookingService.findAllByUser(req.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all system bookings (Admin only)' })
  findAllAll() {
    return this.bookingService.findAll();
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Confirm booking (Admin only)' })
  confirm(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateStatus(id, 'CONFIRMED', dto.reason);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateStatus(id, 'CANCELLED', dto.reason);
  }
}
