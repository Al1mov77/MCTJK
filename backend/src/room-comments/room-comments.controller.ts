import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { RoomCommentsService } from './room-comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Room Comments')
@Controller('room-comments')
export class RoomCommentsController {
  constructor(private readonly roomCommentsService: RoomCommentsService) {}

  @Post(':roomId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a room' })
  @ApiBody({ schema: { type: 'object', properties: { text: { type: 'string', example: 'Very comfortable room!' } } } })
  create(
    @Req() req: any,
    @Param('roomId') roomId: string,
    @Body() dto: { text: string },
  ) {
    return this.roomCommentsService.create(req.user.id, roomId, dto.text);
  }

  @Get()
  @ApiOperation({ summary: 'Get all room comments (global access)' })
  findAll() {
    return this.roomCommentsService.findAll();
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get comments for a specific room' })
  findByRoom(@Param('roomId') roomId: string) {
    return this.roomCommentsService.findByRoom(roomId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment (Admin or Owner)' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.roomCommentsService.remove(req.user.id, req.user.role, id);
  }
}
