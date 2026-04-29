import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all users you have conversations with' })
  getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('messages/:otherId')
  @ApiOperation({ summary: 'Get messages with a specific user' })
  getMessages(@Req() req: any, @Param('otherId') otherId: string) {
    return this.chatService.getMessages(req.user.id, otherId);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a message to another user' })
  @ApiBody({ schema: { type: 'object', properties: { receiverId: { type: 'string' }, text: { type: 'string' } } } })
  sendMessage(@Req() req: any, @Body() dto: { receiverId: string; text: string }) {
    return this.chatService.saveMessage(req.user.id, dto.receiverId, dto.text);
  }
}
