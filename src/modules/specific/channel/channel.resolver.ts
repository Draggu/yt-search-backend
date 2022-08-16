import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { ChannelService } from './channel.service';
import { ProposeChannelInput } from './dto/propose-channel.input';
import { ChannelProposalEntity } from './entities/channel-proposal.entity';
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

    @Query(() => [ChannelProposalEntity])
    channelProposals(
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        _: CurrentUser,
        @Args('page') page: PageInput,
        @Args('ytId', { type: () => ID, nullable: true }) ytId?: string,
    ): Promise<ChannelProposalEntity[]> {
        return this.channelService.findProposals(page, ytId);
    }

    @Mutation(() => ChannelProposalEntity)
    proposeChannel(
        @Auth() currentUser: CurrentUser,
        @Args('proposal') proposal: ProposeChannelInput,
    ): Promise<ChannelProposalEntity> {
        return this.channelService.propose(currentUser, proposal);
    }

    @Mutation(() => ChannelProposalEntity, {
        nullable: true,
    })
    rejectChannelProposal(
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        _: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
    ): Promise<ChannelProposalEntity | undefined> {
        return this.channelService.rejectProposal(id);
    }

    @Mutation(() => ChannelEntity)
    acceptChannelProposal(
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        currentUser: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
        @Args('edit', { nullable: true }) edit?: ProposeChannelInput,
    ): Promise<ChannelEntity> {
        return this.channelService.acceptProposal(currentUser, id, edit);
    }
}
