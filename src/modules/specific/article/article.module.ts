import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkdownMentionModule } from 'modules/generic/markdown-mention/markdown-mention.module';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { ArticleHideEntity } from './entities/article-hide.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { ArticleRevisionFieldResolver } from './fields-resolvers/article-revision.field-resolver';
import { ArticleFieldResolver } from './fields-resolvers/article.field-resolver';

@Module({
    imports: [
        OpinionModule,
        MarkdownMentionModule,
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleRevisionEntity,
            ArticleHideEntity,
        ]),
    ],
    providers: [
        ArticleResolver,
        ArticleFieldResolver,
        ArticleRevisionFieldResolver,
        ArticleService,
    ],
})
export class ArticleModule {}
