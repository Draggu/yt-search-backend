import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity, ArticleRevisionEntity])],
    providers: [ArticleResolver, ArticleService],
})
export class ArticleModule {}
