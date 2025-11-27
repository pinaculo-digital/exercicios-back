import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My new post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is my new post content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
