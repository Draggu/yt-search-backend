import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { ProposeYoutuberInput } from './dto/propose-youtuber.input';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberService } from './youtuber.service';

@Resolver(() => YoutuberEntity)
export class YoutuberResolver {
    constructor(private readonly youtuberService: YoutuberService) {}

    @Mutation(() => YoutuberEntity)
    proposeYoutuber(
        @Auth() currentUser: CurrentUser,
        @Args('proposal') proposeYoutuberInput: ProposeYoutuberInput,
    ): Promise<YoutuberEntity> {
        return this.youtuberService.propose(currentUser, proposeYoutuberInput);
    }

    @Query(() => YoutuberEntity)
    youtuber(
        @Args('id', { type: () => ID }) id: string,
    ): Promise<YoutuberEntity> {
        return this.youtuberService.findOne(id);
    }
}
