import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'room-uuid-here' })
  @IsString()
  roomId: string;

  @ApiProperty({ example: '2026-05-01T14:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-05T12:00:00Z' })
  @IsDateString()
  endDate: string;

}

export class UpdateBookingStatusDto {
  @ApiProperty({ example: 'Your booking was rejected because...', required: false })
  @IsString()
  reason?: string;
}
