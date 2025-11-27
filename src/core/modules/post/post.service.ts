import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { EditPostDto } from './dto/edit-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ListPostsDto } from './dto/list-posts.dto';
import { AppErrorNotFound } from 'src/utils/errors/app-errors';
import { Prisma } from 'generated/prisma';
import { EditPostResponse, CreatePostResponse, ListPostsResponse } from './doc/post.doc';
import { PaginatedResponseDto } from 'src/core/types/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getUserProfile(userId: string) {
    const profile = await this.prismaService.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppErrorNotFound('Profile not found');
    }

    return profile;
  }

  async findById({ userId, postId }: { userId: string; postId: string }) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
        deleted: false,
        author: {
          userId,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      throw new AppErrorNotFound('Post not found');
    }

    return post;
  }

  async create({
    userId,
    body,
  }: {
    userId: string;
    body: CreatePostDto;
  }): Promise<CreatePostResponse> {
    const profile = await this.getUserProfile(userId);

    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: profile.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async list({
    userId,
    query,
  }: {
    userId: string;
    query: ListPostsDto;
  }): Promise<ListPostsResponse> {
    const { page, limit } = query;

    const profile = await this.getUserProfile(userId);

    const where: Prisma.PostWhereInput = {
      authorId: profile.id,
      deleted: false,
    };

    const [posts, total] = await Promise.all([
      this.prismaService.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.post.count({ where }),
    ]);

    return new PaginatedResponseDto({
      data: posts,
      total,
      page,
      limit,
    });
  }

  async edit({
    userId,
    postId,
    body,
  }: {
    userId: string;
    postId: string;
    body: EditPostDto;
  }): Promise<EditPostResponse> {
    await this.findById({ userId, postId });

    return await this.prismaService.post.update({
      where: { id: postId },
      data: body,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete({ userId, postId }: { userId: string; postId: string }): Promise<void> {
    await this.findById({ userId, postId });

    await this.prismaService.post.update({
      where: { id: postId },
      data: { deleted: true },
    });
  }
}
