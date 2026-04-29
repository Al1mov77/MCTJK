import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateHotelDto {
  @ApiProperty({ example: 'The Grand MCTJK' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A luxury hotel in the heart of Dushanbe' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['https://example.com/hotel1.jpg'] })
  @IsArray()
  images: string[];

  @ApiProperty({ example: 'Dushanbe' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Rudaki Ave, 123' })
  @IsString()
  address: string;

  @ApiProperty({ example: ['VIP Lounge', 'Private Spa'] })
  @IsArray()
  @IsOptional()
  skills?: string[];
}

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}

export class HotelQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  minPrice?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maxPrice?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  minRating?: string;
}
