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
        @Dataloader() dataloader: OpinionsDataloader,
    ): Promise<OpinionEntity[]> {
        return dataloader.load({ id: article.opinionTarget.id, page });
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
        @Dataloader() dataloader: HidesDataloader,
    ): Promise<HideEntity[]> {
        return dataloader.load({ id: article.hideTarget.id, page });
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
