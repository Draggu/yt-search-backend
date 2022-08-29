import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
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
    opinions(
        @Parent() article: ArticleEntity,
        @Args('page') page: PageInput,
        @Dataloader() opinionsTargetdataloader: ArticleOpinionsTargetDataloader,
        @Dataloader() opinionsDataloader: OpinionsDataloader,
        @Auth({
            optional: true,
        })
        currentUser?: CurrentUser,
    ): Promise<OpinionEntity[]> {
        return opinionsTargetdataloader.load(article.id).then(({ id }) =>
            opinionsDataloader.load({
                id,
                page,
                currentUser,
            }),
        );
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
    hides(
        @Parent() article: ArticleEntity,
        @Args('page') page: PageInput,
        @Dataloader() hidesDataloader: HidesDataloader,
        @Dataloader() hidesTargetdataloader: ArticleHidesTargetDataloader,
    ): Promise<HideEntity[]> {
        return hidesTargetdataloader.load(article.id).then(({ id }) =>
            hidesDataloader.load({
                id,
                page,
            }),
        );
    }

    @ResolveField(() => ArticleRevisionEntity)
    newestContent(
        @Parent() article: ArticleEntity,
        @Dataloader() dataloader: ArticleContentDataloader,
    ): Promise<ArticleRevisionEntity> {
        return dataloader.load(article.id);
    }

    @ResolveField(() => Boolean)
    isHiden(
        @Parent() article: ArticleEntity,
        @Dataloader() hidesTargetdataloader: ArticleHidesTargetDataloader,
    ): Promise<boolean> {
        return hidesTargetdataloader
            .load(article.id)
            .then(({ isHiden }) => isHiden);
    }
}
