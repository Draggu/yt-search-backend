import { Type } from '@nestjs/common';
import {
    Args,
    ID,
    Mutation,
    Parent,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionAuthorDataloader } from './opinion.dataloader';
import { OpinionService } from './opinion.service';

export interface OpinionResolverOptions {
    methodName: string;
    targetIdName: string;
}

let i = 0;

export const createOpinionResolver = (
    entity: Type,
    { methodName, targetIdName }: OpinionResolverOptions,
) => {
    @Resolver(() => entity)
    class OpinionResolver {
        constructor(private readonly opinionService: OpinionService) {}

        @Mutation(() => entity, { name: methodName })
        createOpinion(
            //FIXME
            // name must be same across all calls of createOpinionResolver
            // otherwise targetId is undefined
            // idk why
            @Args({ type: () => ID, name: 'targetIdName' })
            targetId: string,
            @Args('opinion') createOpinionInput: CreateOpinionInput,
            @Auth({
                optional: true,
                permissions: [Permissions.COMMENT],
            })
            currentUser?: CurrentUser,
        ): Promise<OpinionEntity> {
            return this.opinionService.create(
                createOpinionInput,
                targetId,
                currentUser,
            );
        }

        @ResolveField(() => UserEntity, { nullable: true })
        author(
            @Parent() opinion: OpinionEntity,
            @Dataloader() dataloader: OpinionAuthorDataloader,
        ): Promise<UserEntity | undefined | null> {
            return dataloader.load(opinion.id);
        }
    }

    return OpinionResolver;
};
