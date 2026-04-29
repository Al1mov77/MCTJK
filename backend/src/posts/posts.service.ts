import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(text: string, image?: string) {
    return this.prisma.post.create({
      data: { text, image },
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
