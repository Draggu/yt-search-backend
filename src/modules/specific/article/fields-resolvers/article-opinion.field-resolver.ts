import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OpinionTargetDataloader } from 'modules/generic/opinion/opinion.dataloader';
import { OpinionResolver } from 'modules/generic/opinion/opinion.resolver';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { ArticleOpinionEntity } from '../entities/article-opinion.entity';
import { ArticleEntity } from '../entities/article.entity';

@Resolver(() => ArticleOpinionEntity)
export class ArticleOpinionFieldResolver extends OpinionResolver(
    ArticleOpinionEntity,
    {
        methodName: 'commentArticle',
        targetIdName: 'articleId',
    },
) {
    @ResolveField(() => ArticleEntity)
    target(
        @Parent() opinion: ArticleOpinionEntity,
        @Dataloader() dataloader: OpinionTargetDataloader,
    ) {
        return dataloader.load(opinion.id);
    }
}
