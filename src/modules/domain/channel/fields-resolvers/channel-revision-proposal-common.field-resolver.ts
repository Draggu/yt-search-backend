import { Type } from '@nestjs/common';
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
import { ChannelRevisionProposalCommonEntity } from '../entities/channel-revision-proposal-common.entity';

export const ChannelRevisionProposalCommonFieldResolver = <
    T extends ChannelRevisionProposalCommonEntity,
>(
    entity: Type<T>,
) => {
    @Resolver(() => entity, { isAbstract: true })
    class ChannelRevisionProposalCommonFieldResolver {
        @ResolveField(() => UserEntity)
        editedBy(
            @Parent() channelRevision: T,
            @Dataloader() dataloader: ChannelRevisionEditorDataloader,
        ): Promise<UserEntity> {
            return dataloader.load(channelRevision.id);
        }

        @ResolveField(() => [CategorieEntity])
        categories(
            @Parent() channelRevision: T,
            @Dataloader() dataloader: ChannelRevisionCategoriesDataloader,
        ): Promise<CategorieEntity[]> {
            return dataloader.load(channelRevision.id);
        }

        @ResolveField(() => MentionEntity)
        mentions(
            @Parent() channelRevision: T,
            @Dataloader() dataloader: MentionDataloader,
        ): Promise<MentionEntity> {
            return dataloader.load(channelRevision.mentions);
        }
    }

    return ChannelRevisionProposalCommonFieldResolver;
};
