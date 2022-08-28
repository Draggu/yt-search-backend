import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { HideEntity } from 'modules/generic/hides/entities/hide.entity';
import { HidesDataloader } from 'modules/generic/hides/hides.dataloader';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { OpinionsDataloader } from 'modules/generic/opinion/opinion.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Skip1MorePipe } from 'pipes/skip-1-more.pipe';
import {
    ArticleAuthorDataloader,
    ArticleContentDataloader,
    ArticleHidesTargetDataloader,
    ArticleOpinionsTargetDataloader,
    ArticleRevisionsDataloader,
} from '../article.dataloader';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';
import { ArticleEntity } from '../entities/article.entity';

@Resolver(() => ArticleEntity)
export class ArticleFieldResolver {
    @ResolveField(() => UserEntity)
    author(
        @Parent() article: ArticleEntity,
        @Dataloader() dataloader: ArticleAuthorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(article.id);
    }

    @ResolveField(() => [OpinionEntity])
    async opinions(
        @Parent() article: ArticleEntity,
        @Args('page') page: PageInput,
        @Dataloader() opinionsTargetdataloader: ArticleOpinionsTargetDataloader,
        @Dataloader() opinionsDataloader: OpinionsDataloader,
    ): Promise<OpinionEntity[]> {
        const { id } = await opinionsTargetdataloader.load(article.id);

        return opinionsDataloader.load({
            id,
            page,
        });
    }

    @ResolveField(() => [ArticleRevisionEntity])
    revisions(
        @Parent() article: ArticleEntity,
        @Args('page', Skip1MorePipe) page: PageInput,
        @Dataloader() dataloader: ArticleRevisionsDataloader,
    ): Promise<ArticleRevisionEntity[]> {
        return dataloader.load({ id: article.id, page });
    }

    @ResolveField(() => [HideEntity])
    async hides(
        @Parent() article: ArticleEntity,
        @Args('page') page: PageInput,
        @Dataloader() hidesDataloader: HidesDataloader,
        @Dataloader() hidesTargetdataloader: ArticleHidesTargetDataloader,
    ): Promise<HideEntity[]> {
        const { id } = await hidesTargetdataloader.load(article.id);

        return hidesDataloader.load({
            id,
            page,
        });
    }

    @ResolveField(() => ArticleRevisionEntity)
    newestContent(
        @Parent() article: ArticleEntity,
        @Dataloader() dataloader: ArticleContentDataloader,
    ): Promise<ArticleRevisionEntity> {
        return dataloader.load(article.id);
    }

    @ResolveField(() => Boolean)
    isHiden(@Parent() article: ArticleEntity): boolean {
        return article.hideTarget.isHiden;
    }
}
