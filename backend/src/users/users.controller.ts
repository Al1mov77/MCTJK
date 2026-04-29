import { Controller, Get, Post, Patch, UseGuards, Req, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, avatar: true, isVip: true, points: true }
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile with VIP status and points' })
  async getProfile(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true, role: true, avatar: true,
        isVip: true, points: true, lastBonusAt: true,
        _count: { select: { bookings: true } }
      },
    });
    return user;
  }

  @Post('claim-bonus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Claim daily bonus points (100 pts/day)' })
  async claimDailyBonus(@Req() req: any) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
    
    const now = new Date();
    if (user.lastBonusAt) {
      const last = new Date(user.lastBonusAt);
      const diff = now.getTime() - last.getTime();
      if (diff < 24 * 60 * 60 * 1000) {
        return { success: false, message: 'Bonus already claimed today', nextClaimAt: new Date(last.getTime() + 24 * 60 * 60 * 1000) };
      }
    }
    
    const newPoints = (user.points || 0) + 100;
    const updated = await this.prisma.user.update({
      where: { id: req.user.id },
      data: { points: newPoints, lastBonusAt: now } as any,
    });
    
    return { success: true, pointsAwarded: 100, totalPoints: updated.points };
  }

  @Get('vip-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get VIP status and discount tier' })
  async getVipStatus(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: { _count: { select: { bookings: true } } },
    });
    
    const bookingCount = user._count.bookings;
    let discount = 0;
    let tier = 'STANDARD';
    
    if (bookingCount >= 10) {
      discount = 30;
      tier = 'VIP ELITE';
    } else if (bookingCount >= 5) {
      discount = 20;
      tier = 'VIP GOLD';
    } else if (bookingCount >= 3) {
      discount = 10;
      tier = 'VIP SILVER';
    }

    // Auto-update VIP status
    if (bookingCount >= 10 && !user.isVip) {
      await this.prisma.user.update({ where: { id: req.user.id }, data: { isVip: true } as any });
    }

    return {
      tier,
      discount,
      isVip: bookingCount >= 10 || user.isVip,
      totalBookings: bookingCount,
      bookingsToNextTier: bookingCount < 3 ? 3 - bookingCount : bookingCount < 5 ? 5 - bookingCount : bookingCount < 10 ? 10 - bookingCount : 0,
      points: user.points,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile (name/password)' })
  @ApiBody({ schema: { type: 'object', properties: { name: { type: 'string', example: 'User Name' }, password: { type: 'string', example: '********' } } } })
  async updateProfile(@Req() req: any, @Body() dto: any) {
    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.password) {
      const bcrypt = require('bcrypt');
      data.password = await bcrypt.hash(dto.password, 10);
    }
    
    const updated = await this.prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, name: true, role: true, avatar: true, isVip: true }
    });
    
    return updated;
  }

  @Patch(':id/vip')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle VIP status (Admin only)' })
  async toggleVip(@Param('id') id: string, @Body() dto: { isVip: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data: { isVip: dto.isVip } as any,
    });
  }
}
