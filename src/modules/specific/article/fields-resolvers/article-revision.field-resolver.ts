import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { ArticleService } from '../article.service';
import { ArticleRevisionCategoriesDataloader } from '../dataloaders/article-revision-categories.dataloader';
import { ArticleRevisionEditorDataloader } from '../dataloaders/article-revision-editor.dataloader';
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
    constructor(private readonly articleService: ArticleService) {}

    @ResolveField(() => ArticleRevisionEntity, { nullable: true })
    previous(
        @Parent() revision: ArticleRevisionEntity,
    ): Promise<ArticleRevisionEntity | null> {
        //TODO dataloader
        return this.articleService.previousRevision(revision);
    }
}
