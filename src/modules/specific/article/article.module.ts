import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HidesModule } from 'modules/generic/hides/hides.module';
import { MarkdownMentionModule } from 'modules/generic/markdown-mention/markdown-mention.module';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { ArticleRevisionFieldResolver } from './fields-resolvers/article-revision.field-resolver';
import { ArticleFieldResolver } from './fields-resolvers/article.field-resolver';

@Module({
    imports: [
        HidesModule,
        OpinionModule,
        MarkdownMentionModule,
        TypeOrmModule.forFeature([ArticleEntity, ArticleRevisionEntity]),
    ],
    providers: [
        ArticleResolver,
        ArticleFieldResolver,
        ArticleRevisionFieldResolver,
        ArticleService,
    ],
})
export class ArticleModule {}
