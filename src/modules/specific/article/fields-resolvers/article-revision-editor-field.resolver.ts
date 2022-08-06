import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { ArticleAuthorDataloader } from '../dataloaders/article-author.dataloader';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';

@Resolver(() => ArticleRevisionEntity)
export class ArticleRevisionEditorFieldResolver {
    @ResolveField(() => UserEntity)
    editedBy(
        @Parent() articleRevision: ArticleRevisionEntity,
        @Dataloader() dataloader: ArticleAuthorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(articleRevision.id);
    }
}
