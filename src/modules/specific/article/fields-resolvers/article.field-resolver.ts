import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Skip1MorePipe } from 'pipes/skip-1-more.pipe';
import {
    ArticleAuthorDataloader,
    ArticleContentDataloader,
    ArticleOpinionsDataloader,
    ArticleRevisionsDataloader,
} from '../article.dataloader';
import { ArticleOpinionEntity } from '../entities/article-opinion.entity';
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

    @ResolveField(() => [ArticleOpinionEntity])
    opinions(
        @Parent() article: ArticleEntity,
        @Args('page') page: PageInput,
        @Dataloader() dataloader: ArticleOpinionsDataloader,
    ): Promise<ArticleOpinionEntity[]> {
        return dataloader.load({ id: article.id, page });
    }

    @ResolveField(() => [ArticleRevisionEntity])
    revisions(
        @Parent() article: ArticleEntity,
        @Args('page', Skip1MorePipe) page: PageInput,
        @Dataloader() dataloader: ArticleRevisionsDataloader,
    ): Promise<ArticleRevisionEntity[]> {
        return dataloader.load({ id: article.id, page });
    }

    @ResolveField(() => ArticleRevisionEntity)
    content(
        @Parent() article: ArticleEntity,
        @Dataloader() dataloader: ArticleContentDataloader,
    ): Promise<ArticleRevisionEntity> {
        return dataloader.load(article.id);
    }
}
