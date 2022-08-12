import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import {
    ChannelContentDataloader,
    ChannelOpinionsDataloader,
} from '../channel.dataloader';
import { ChannelOpinionEntity } from '../entities/channel-opinion.entity';
import { ChannelRevisionEntity } from '../entities/channel-revision.entity';
import { ChannelEntity } from '../entities/channel.entity';

@Resolver(() => ChannelEntity)
export class ChannelFieldResolver {
    @ResolveField(() => ChannelRevisionEntity)
    content(
        @Parent() channel: ChannelEntity,
        @Dataloader() dataloader: ChannelContentDataloader,
    ): Promise<ChannelRevisionEntity> {
        return dataloader.load(channel.ytId);
    }

    @ResolveField(() => [ChannelOpinionEntity])
    opinions(
        @Parent() channel: ChannelEntity,
        @Dataloader() dataloader: ChannelOpinionsDataloader,
    ): Promise<ChannelOpinionEntity[]> {
        return dataloader.load(channel.ytId);
    }
}
