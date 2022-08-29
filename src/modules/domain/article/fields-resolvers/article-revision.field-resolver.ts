import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/domain/categorie/entities/categorie.entity';
import { MentionEntity } from 'modules/domain/markdown-mention/entities/entity.mention';
import { MentionDataloader } from 'modules/domain/markdown-mention/mention.dataloader';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import {
    ArticleRevisionCategoriesDataloader,
    ArticleRevisionEditorDataloader,
} from '../article.dataloader';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';

@Resolver(() => ArticleRevisionEntity)
export class ArticleRevisionFieldResolver {
    @ResolveField(() => UserEntity)
    editedBy(
        @Parent() articleRevision: ArticleRevisionEntity,
        @Dataloader() dataloader: ArticleRevisionEditorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(articleRevision.id);
    }

    @ResolveField(() => [CategorieEntity])
    categories(
        @Parent() articleRevision: ArticleRevisionEntity,
        @Dataloader() dataloader: ArticleRevisionCategoriesDataloader,
    ): Promise<CategorieEntity[]> {
        return dataloader.load(articleRevision.id);
    }

    @ResolveField(() => MentionEntity)
    mentions(
        @Parent() articleRevision: ArticleRevisionEntity,
        @Dataloader() dataloader: MentionDataloader,
    ): Promise<MentionEntity> {
        return dataloader.load(articleRevision.mentions);
    }
}
