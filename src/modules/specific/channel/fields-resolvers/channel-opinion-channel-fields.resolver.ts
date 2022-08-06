import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OpinionTargetDataloader } from 'modules/generic/opinion/dataloaders/opinion-target.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { ChannelOpinionEntity } from '../entities/channel-opinion.entity';
import { ChannelEntity } from '../entities/channel.entity';

@Resolver(() => ChannelOpinionEntity)
export class ChannelOpinionFieldResolver {
    @ResolveField(() => ChannelEntity)
    target(
        @Parent() opinion: ChannelOpinionEntity,
        @Dataloader() dataloader: OpinionTargetDataloader,
    ) {
        return dataloader.load(opinion.id);
    }
}
