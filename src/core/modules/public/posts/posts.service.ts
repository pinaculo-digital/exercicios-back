import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/integrations/persistence/database/prisma/prisma.service';
import { ListPostsDto } from '../../post/dto/list-posts.dto';
import { ListPostsWithAutorResponse } from '../../post/doc/post.doc';
import { PaginatedResponseDto } from 'src/core/types/dto/pagination.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PublicPostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async listPublic(query: ListPostsDto): Promise<ListPostsWithAutorResponse> {
    const { page, limit, author, title } = query;

    const where: Prisma.PostWhereInput = {
      deleted: false,
      author: {
        username: {
          contains: author,
          mode: 'insensitive',
        },
      },
      title: {
        contains: title,
        mode: 'insensitive',
      },
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
          author: {
            select: {
              username: true,
            },
          },
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
      query: { author, title },
    });
  }
}
