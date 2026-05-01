import { Module } from '@nestjs/common';
import { RoomCommentsService } from './room-comments.service';
import { RoomCommentsController } from './room-comments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomCommentsController],
  providers: [RoomCommentsService],
  exports: [RoomCommentsService],
})
export class RoomCommentsModule {}
