import { Type } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionService } from './opinion.service';

export interface OpinionResolverOptions {
    methodName: string;
    tragetIdName: string;
}

export const createOpinionResolver = (
    entity: Type,
    { methodName, tragetIdName }: OpinionResolverOptions,
) => {
    @Resolver()
    class OpinionResolver {
        constructor(private readonly opinionService: OpinionService) {}

        @Mutation(() => entity, { name: methodName })
        createOpinion(
            @Args('opinion') createOpinionInput: CreateOpinionInput,
            @Args(tragetIdName, { type: () => ID }) targetId: string,
            @Auth({
                optional: true,
            })
            currentUser?: CurrentUser,
        ): Promise<OpinionEntity> {
            return this.opinionService.create(
                createOpinionInput,
                targetId,
                currentUser,
            );
        }
    }

    return OpinionResolver;
};
