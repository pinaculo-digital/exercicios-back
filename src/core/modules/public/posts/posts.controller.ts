import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicPostsService } from './posts.service';
import { Doc } from 'src/utils/documentation/doc';
import { ListPostsDto } from '../../post/dto/list-posts.dto';
import { ListPostsWithAutorResponse } from '../../post/doc/post.doc';

@ApiTags('Public/Posts')
@Controller('public/posts')
export class PublicPostsController {
  constructor(private readonly publicPostsService: PublicPostsService) {}

  @Doc({
    name: 'List posts',
    description: 'List all public posts with pagination and filters',
    response: ListPostsWithAutorResponse,
    hasAuth: false,
  })
  @Get()
  async listPublic(@Query() query: ListPostsDto) {
    return await this.publicPostsService.listPublic(query);
  }
}
