import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { ProposeYoutuberInput } from './dto/propose-youtuber.input';
import { YoutuberProposalEntity } from './entities/youtuber-proposal.entity';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberService } from './youtuber.service';

@Resolver(() => YoutuberEntity)
export class YoutuberResolver {
    constructor(private readonly youtuberService: YoutuberService) {}

    @Mutation(() => YoutuberProposalEntity)
    proposeYoutuber(
        @Auth() currentUser: CurrentUser,
        @Args('proposal') proposeYoutuberInput: ProposeYoutuberInput,
    ): Promise<YoutuberProposalEntity> {
        return this.youtuberService.propose(currentUser, proposeYoutuberInput);
    }

    @Query(() => YoutuberEntity, { nullable: true })
    youtuber(
        @Args('id', { type: () => ID }) id: string,
    ): Promise<YoutuberEntity | null> {
        return this.youtuberService.findOne(id);
    }

    @Mutation(() => YoutuberProposalEntity, {
        nullable: true,
    })
    rejectYoutuberProposal(
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        _: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
    ): Promise<YoutuberProposalEntity | undefined> {
        return this.youtuberService.rejectProposal(id);
    }

    @Mutation(() => YoutuberEntity)
    acceptYoutuberProposal(
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        currentUser: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
        @Args('edit', { nullable: true }) edit?: ProposeYoutuberInput,
    ): Promise<YoutuberEntity> {
        return this.youtuberService.acceptProposal(currentUser, id, edit);
    }
}
