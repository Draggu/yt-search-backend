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
import { CreateHideInput } from '../hides/dto/create-hide.input';
import { HideEntity } from '../hides/entities/hide.entity';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionAuthorDataloader } from './opinion.dataloader';
import { OpinionService } from './opinion.service';

@Resolver(() => OpinionEntity)
export class OpinionResolver {
    constructor(private readonly opinionService: OpinionService) {}

    @ResolveField(() => UserEntity, { nullable: true })
    author(
        @Parent() opinion: OpinionEntity,
        @Dataloader() dataloader: OpinionAuthorDataloader,
    ): Promise<UserEntity | undefined | null> {
        return dataloader.load(opinion.id);
    }

    @ResolveField(() => Boolean)
    isHiden(@Parent() opinion: OpinionEntity): boolean {
        return opinion.hideTarget.isHiden;
    }

    @Mutation(() => HideEntity)
    toogleOpinionHide(
        @Auth({
            permissions: [Permissions.TOGGLE_HIDE],
        })
        currentUser: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
        @Args('createHideInput') createHideInput: CreateHideInput,
    ): Promise<HideEntity> {
        return this.opinionService.toogleHide(currentUser, id, createHideInput);
    }
}
