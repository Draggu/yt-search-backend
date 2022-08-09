import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { YoutuberRevisionCategoriesDataloader } from '../dataloaders/youtuber-revision-categories.dataloader';
import { YoutuberRevisionEditorDataloader } from '../dataloaders/youtuber-revision.dataloader';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';

@Resolver(() => YoutuberRevisionEntity)
export class YoutuberRevisionFieldResolver {
    @ResolveField(() => UserEntity)
    editedBy(
        @Parent() youtuberRevision: YoutuberRevisionEntity,
        @Dataloader() dataloader: YoutuberRevisionEditorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(youtuberRevision.id);
    }

    @ResolveField(() => [CategorieEntity])
    categories(
        @Parent() youtuberRevision: YoutuberRevisionEntity,
        @Dataloader() dataloader: YoutuberRevisionCategoriesDataloader,
    ): Promise<CategorieEntity[]> {
        return dataloader.load(youtuberRevision.id);
    }
}
