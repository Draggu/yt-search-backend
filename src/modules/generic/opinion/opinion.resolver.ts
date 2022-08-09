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
import { CurrentUser } from 'directives/auth/types';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { OpinionAuthorDataloader } from './dataloaders/opinion-author.dataloader';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionService } from './opinion.service';

export interface OpinionResolverOptions {
    methodName: string;
    targetIdName: string;
}

export const createOpinionResolver = (
    entity: Type,
    { methodName, targetIdName }: OpinionResolverOptions,
) => {
    @Resolver(() => entity)
    class OpinionResolver {
        constructor(private readonly opinionService: OpinionService) {}

        @Mutation(() => entity, { name: methodName })
        createOpinion(
            @Args('opinion') createOpinionInput: CreateOpinionInput,
            @Args(targetIdName, { type: () => ID }) targetId: string,
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
