import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionService } from './opinion.service';

@Resolver(() => OpinionEntity)
export class OpinionResolver {
    constructor(private readonly opinionService: OpinionService) {}

    @Mutation(() => OpinionEntity)
    createOpinion(
        @Auth() currentUser: CurrentUser,
        @Args('opinion') createOpinionInput: CreateOpinionInput,
    ) {
        return this.opinionService.create(currentUser, createOpinionInput);
    }
}
