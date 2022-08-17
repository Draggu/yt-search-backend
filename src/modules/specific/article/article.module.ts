import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ArticleHideEntity } from './entities/article-hide.entity';
import { ArticleOpinionEntity } from './entities/article-opinion.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { ArticleOpinionFieldResolver } from './fields-resolvers/article-opinion.field-resolver';
import { ArticleRevisionFieldResolver } from './fields-resolvers/article-revision.field-resolver';
import { ArticleFieldResolver } from './fields-resolvers/article.field-resolver';

@Module({
    imports: [
        OpinionModule.forFeature(ArticleOpinionEntity),
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleRevisionEntity,
            ArticleHideEntity,
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
