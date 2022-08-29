import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/domain/categorie/entities/categorie.entity';
import { MentionEntity } from 'modules/domain/markdown-mention/entities/entity.mention';
import { MentionDataloader } from 'modules/domain/markdown-mention/mention.dataloader';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
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
