import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { ArticleService } from '../article.service';
import { ArticleAuthorDataloader } from '../dataloaders/article-author.dataloader';
import { ArticleOpinionsDataloader } from '../dataloaders/article-opinions.dataloader';
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
        @Dataloader() dataloader: ArticleOpinionsDataloader,
    ): Promise<ArticleOpinionEntity[]> {
        return dataloader.load(article.id);
    }

    constructor(private readonly articleService: ArticleService) {}
    @ResolveField(() => ArticleRevisionEntity)
    content(@Parent() article: ArticleEntity): Promise<ArticleRevisionEntity> {
        //TODO dataloader
        return this.articleService.getContent(article);
    }

    @ResolveField(() => [UserEntity], {
        description:
            'this does not include original Author! There is no order guarantee!',
    })
    allEditors(@Parent() article: ArticleEntity): Promise<UserEntity[]> {
        //TODO dataloader
        return this.articleService.getAllEditors(article);
    }
}
