import { Global, Module } from '@nestjs/common';
import { CommonModule } from './modules/common/common.module';
import { PrismaModule } from 'src/integrations/persistence/database/prisma/prisma.module';
import { AuthModule } from './modules/public/auth/auth.module';
import { PublicPostsModule } from './modules/public/posts/posts.module';
import { PostModule } from './modules/post/post.module';
import { ProfileModule } from './modules/profile/profile.module';

@Global()
@Module({
  imports: [CommonModule, PrismaModule, AuthModule, PublicPostsModule, PostModule, ProfileModule],
})
export class CoreModule {}
