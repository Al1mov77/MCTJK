'use client'

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId?: string; roomId?: string; text: string },
  ) {
    const senderId = client.data.user.id;
    
    try {
      const message = await this.chatService.saveMessage(
        senderId, 
        data.roomId ? null : data.receiverId, 
        data.text,
        data.roomId
      );
      
      if (data.roomId) {
        // Broadcast to the room
        this.server.to(data.roomId).emit('receive_message', message);
      } else if (data.receiverId) {
        // Emit to specific user
        this.server.to(data.receiverId).emit('receive_message', message);
      }
      
      return message;
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data?: { roomId?: string }) {
    const userId = client.data.user.id;
    const isVip = client.data.user.isVip;

    if (data?.roomId === 'VIP_MEMBERS') {
      if (!isVip) return { status: 'error', message: 'VIP only' };
      client.join('VIP_MEMBERS');
      return { status: 'joined', room: 'VIP_MEMBERS' };
    }

    client.join(userId);
    return { status: 'joined', userId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get_messages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { otherId?: string; roomId?: string },
  ) {
    const userId = client.data.user.id;
    
    if (data.roomId) {
      if (data.roomId === 'VIP_MEMBERS' && !client.data.user.isVip) return [];
      return this.chatService.getRoomMessages(data.roomId);
    }
    
    if (data.otherId) {
      return this.chatService.getMessages(userId, data.otherId);
    }
    
    return [];
  }
}
