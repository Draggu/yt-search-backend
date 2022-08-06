import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { ArticleAuthorDataloader } from '../dataloaders/article-author.dataloader';
import { ArticleEntity } from '../entities/article.entity';

@Resolver(() => ArticleEntity)
export class ArticleAuthorFieldResolver {
    @ResolveField(() => UserEntity)
    author(
        @Parent() article: ArticleEntity,
        @Dataloader() dataloader: ArticleAuthorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(article.id);
    }
}
