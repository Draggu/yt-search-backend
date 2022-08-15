import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserEntity, { nullable: true })
    user(
        @Args('id', { type: () => ID }) id: string,
    ): Promise<UserEntity | null> {
        return this.userService.findOne(id);
    }

    @Mutation(() => UserEntity)
    updateUser(
        @Auth() currentUser: CurrentUser,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ): Promise<UserEntity> {
        return this.userService.update(currentUser, updateUserInput);
    }
}
