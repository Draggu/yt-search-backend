import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionAuthorDataloader } from './opinion.dataloader';

@Resolver(() => OpinionEntity)
export class OpinionResolver {
    @ResolveField(() => UserEntity, { nullable: true })
    author(
        @Parent() opinion: OpinionEntity,
        @Dataloader() dataloader: OpinionAuthorDataloader,
    ): Promise<UserEntity | undefined | null> {
        return dataloader.load(opinion.id);
    }
}
