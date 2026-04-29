import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto, UpdateHotelDto, HotelQueryDto } from './dto/hotel.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hotels with filters' })
  findAll(@Query() query: HotelQueryDto) {
    return this.hotelsService.findAll(query);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get all unique skills/amenities' })
  getSkills() {
    return this.hotelsService.getUniqueSkills();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new hotel (Admin only)' })
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a hotel (Admin only)' })
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(id, updateHotelDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a hotel (Admin only)' })
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(id);
  }
}
