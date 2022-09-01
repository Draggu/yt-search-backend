import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { ChannelRevisionAcceptorDataloader } from '../channel.dataloader';
import { ChannelRevisionEntity } from '../entities/channel-revision.entity';
import { ChannelRevisionProposalCommonFieldResolver } from './channel-revision-proposal-common.field-resolver';

@Resolver(() => ChannelRevisionEntity)
export class ChannelRevisionFieldResolver extends ChannelRevisionProposalCommonFieldResolver(
    ChannelRevisionEntity,
) {
    @ResolveField(() => UserEntity)
    acceptedBy(
        @Parent() channelRevision: ChannelRevisionEntity,
        @Dataloader() dataloader: ChannelRevisionAcceptorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(channelRevision.id);
    }
}
