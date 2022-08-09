import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { ChannelRevisionCategoriesDataloader } from '../dataloaders/channel-revision-categories.dataloader';
import { ChannelRevisionEditorDataloader } from '../dataloaders/channel-revision-editor.dataloader';
import { ChannelRevisionEntity } from '../entities/channel-revision.entity';

@Resolver(() => ChannelRevisionEntity)
export class ChannelRevisionFieldResolver {
    @ResolveField(() => UserEntity)
    editedBy(
        @Parent() channelRevision: ChannelRevisionEntity,
        @Dataloader() dataloader: ChannelRevisionEditorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(channelRevision.id);
    }

    @ResolveField(() => [CategorieEntity])
    categories(
        @Parent() channelRevision: ChannelRevisionEntity,
        @Dataloader() dataloader: ChannelRevisionCategoriesDataloader,
    ): Promise<CategorieEntity[]> {
        return dataloader.load(channelRevision.id);
    }
}
