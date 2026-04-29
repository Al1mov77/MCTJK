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
    @MessageBody() data: { receiverId: string; text: string },
  ) {
    const senderId = client.data.user.id;
    const message = await this.chatService.saveMessage(senderId, data.receiverId, data.text);
    
    // Emit to receiver if online
    this.server.to(data.receiverId).emit('receive_message', message);
    
    // Also send back to sender for confirmation
    return message;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket) {
    const userId = client.data.user.id;
    client.join(userId);
    return { status: 'joined', userId };
  }
}
