import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OpinionTargetDataloader } from 'modules/generic/opinion/dataloaders/opinion-target.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { ArticleOpinionEntity } from '../entities/article-opinion.entity';
import { ArticleEntity } from '../entities/article.entity';

@Resolver(() => ArticleOpinionEntity)
export class ArticleOpinionFieldResolver {
    @ResolveField(() => ArticleEntity)
    target(
        @Parent() opinion: ArticleOpinionEntity,
        @Dataloader() dataloader: OpinionTargetDataloader,
    ) {
        return dataloader.load(opinion.id);
    }
}
