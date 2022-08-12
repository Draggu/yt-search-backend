import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';
import {
    YoutuberRevisionCategoriesDataloader,
    YoutuberRevisionEditorDataloader,
} from '../youtuber.dataloader';

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
