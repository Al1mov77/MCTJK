import { Controller, Get, Post, Param, Body, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all users you have conversations with' })
  async getConversations(@Req() req: any) {
    const contacts = await this.chatService.getConversations(req.user.id);
    return contacts;
  }

  @Get('messages/:otherId')
  @ApiOperation({ summary: 'Get messages with a specific user or room' })
  @ApiQuery({ name: 'isRoom', required: false, type: Boolean })
  async getMessages(@Req() req: any, @Param('otherId') otherId: string, @Query('isRoom') isRoom?: string) {
    if (isRoom === 'true') {
      if (otherId === 'VIP_MEMBERS' && !req.user.isVip) {
        throw new ForbiddenException('VIP access required');
      }
      return this.chatService.getRoomMessages(otherId);
    }
    return this.chatService.getMessages(req.user.id, otherId);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a message to another user or room' })
  @ApiBody({ schema: { type: 'object', properties: { receiverId: { type: 'string' }, roomId: { type: 'string' }, text: { type: 'string' } } } })
  async sendMessage(@Req() req: any, @Body() dto: { receiverId?: string; roomId?: string; text: string }) {
    return this.chatService.saveMessage(req.user.id, dto.roomId ? null : dto.receiverId, dto.text, dto.roomId);
  }
}
