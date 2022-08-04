import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ArticleService } from './article.service';
import { ArticleOpinionEntity } from './entities/article-opinion.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { ArticleRevisionResolver } from './resolvers/article-revision.resolver';
import { ArticleResolver } from './resolvers/article.resolver';

@Module({
    imports: [
        OpinionModule.forFeature(ArticleOpinionEntity, 'id', {
            methodName: 'commentArticle',
            tragetIdName: 'articleId',
        }),
        TypeOrmModule.forFeature([ArticleEntity, ArticleRevisionEntity]),
    ],
    providers: [ArticleResolver, ArticleRevisionResolver, ArticleService],
})
export class ArticleModule {}
