import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ArticleOpinionEntity } from './entities/article-opinion.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { ArticleOpinionFieldResolver } from './fields-resolvers/article-opinion.field-resolver';
import { ArticleRevisionFieldResolver } from './fields-resolvers/article-revision.field-resolver';
import { ArticleFieldResolver } from './fields-resolvers/article.field-resolver';

@Module({
    imports: [
        OpinionModule.forFeature(ArticleOpinionEntity, 'id', {
            methodName: 'commentArticle',
            targetIdName: 'articleId',
        }),
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleRevisionEntity,
            ArticleOpinionEntity,
        ]),
    ],
    providers: [
        ArticleResolver,
        ArticleOpinionFieldResolver,
        ArticleFieldResolver,
        ArticleRevisionFieldResolver,
        ArticleService,
    ],
})
export class ArticleModule {}
