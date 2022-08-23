import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MentionEntity } from 'modules/generic/markdown-mention/entities/entity.mention';
import { MentionDataloader } from 'modules/generic/markdown-mention/mention.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    ChannelRevisionCategoriesDataloader,
    ChannelRevisionEditorDataloader,
} from '../channel.dataloader';
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

    @ResolveField(() => MentionEntity)
    mentions(
        @Parent() channelRevision: ChannelRevisionEntity,
        @Dataloader() dataloader: MentionDataloader,
    ): Promise<MentionEntity> {
        return dataloader.load(channelRevision.mentions);
    }
}
