import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'hotel-uuid-here' })
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: ['https://example.com/room1.jpg'] })
  @IsArray()
  images: string[];

  @ApiProperty({ example: 'Spacious deluxe room with king-size bed and city view' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
