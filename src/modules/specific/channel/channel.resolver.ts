import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { ChannelService } from './channel.service';
import { ChannelProposalInput } from './dto/channel-proposal.input';
import { ChannelEntity } from './entities/channel.entity';

@Resolver(() => ChannelEntity)
export class ChannelResolver {
    constructor(private readonly channelService: ChannelService) {}

    @Query(() => ChannelEntity, {
        nullable: true,
    })
    channel(
        @Args('ytId', { type: () => ID }) ytId: string,
    ): Promise<ChannelEntity | null> {
        return this.channelService.findOne(ytId);
    }

    @Mutation(() => ChannelEntity)
    proposeChannel(
        @Auth() currentUser: CurrentUser,
        @Args('proposal') proposal: ChannelProposalInput,
    ): Promise<ChannelEntity> {
        return this.channelService.propose(currentUser, proposal);
    }
}
