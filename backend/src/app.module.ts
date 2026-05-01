import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingModule } from './booking/booking.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { RoomCommentsModule } from './room-comments/room-comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HotelsModule,
    RoomsModule,
    BookingModule,
    ChatModule,
    PostsModule,
    ReviewsModule,
    UsersModule,
    RoomCommentsModule,
  ],
})
export class AppModule {}
