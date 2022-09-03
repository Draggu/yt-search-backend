import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { CreateLinkingInput } from './dto/create-linking.input';
import { LinkingProposalEntity } from './entities/linking-proposal.entity';
import { LinkingsService } from './linkings.service';

@Resolver(() => LinkingProposalEntity)
export class LinkingsResolver {
    constructor(private readonly linkingsService: LinkingsService) {}

    @Mutation(() => LinkingProposalEntity)
    proposeLinking(
        @Args('createLinkingInput') createLinkingInput: CreateLinkingInput,
        @Auth({
            permissions: [Permissions.PROPOSE],
        })
        currentUser: CurrentUser,
    ): Promise<LinkingProposalEntity> {
        return this.linkingsService.proposeLinking(
            currentUser,
            createLinkingInput,
        );
    }

    @Mutation(() => ID)
    acceptLinking(
        @Args('id', { type: () => ID }) id: string,
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        currentUser: CurrentUser,
    ): Promise<string> {
        return this.linkingsService.acceptLinking(currentUser, id);
    }

    @Mutation(() => LinkingProposalEntity)
    rejectLinking(
        @Args('id', { type: () => ID }) id: string,
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        currentUser: CurrentUser,
    ): Promise<LinkingProposalEntity> {
        return this.linkingsService.rejectLinking(currentUser, id);
    }

    @Query(() => [LinkingProposalEntity])
    linkingProposals(
        @Auth({
            permissions: [Permissions.ACCEPT_PROPOSAL],
        })
        _: CurrentUser,
        @Args('page') page: PageInput,
    ): Promise<LinkingProposalEntity[]> {
        return this.linkingsService.findAll(page);
    }
}
