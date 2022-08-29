import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { HideEntity } from './entities/hide.entity';
import { HideAuthorDataloader } from './hides.dataloader';

@Resolver(() => HideEntity)
export class HidesResolver {
    @ResolveField(() => UserEntity, { nullable: true })
    author(
        @Parent() hide: HideEntity,
        @Dataloader() dataloader: HideAuthorDataloader,
    ): Promise<UserEntity | undefined | null> {
        return dataloader.load(hide.id);
    }
}
