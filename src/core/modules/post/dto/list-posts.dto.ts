import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/core/types/dto/pagination.dto';

export class ListPostsDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter by author username',
    required: false,
    example: 'john_doe',
  })
  @IsOptional()
  @IsString()
  author: string = '';

  @ApiProperty({
    description: 'Filter by post title (partial match)',
    required: false,
    example: 'my post',
  })
  @IsOptional()
  @IsString()
  title: string = '';
}
