import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { WsJwtGuard } from './ws-jwt.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ChatGateway, ChatService, WsJwtGuard],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
