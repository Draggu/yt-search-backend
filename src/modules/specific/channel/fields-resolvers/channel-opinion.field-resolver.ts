import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OpinionTargetDataloader } from 'modules/generic/opinion/opinion.dataloader';
import { OpinionResolver } from 'modules/generic/opinion/opinion.resolver';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { ChannelOpinionEntity } from '../entities/channel-opinion.entity';
import { ChannelEntity } from '../entities/channel.entity';

@Resolver(() => ChannelOpinionEntity)
export class ChannelOpinionFieldResolver extends OpinionResolver(
    ChannelOpinionEntity,
    {
        methodName: 'commentChannel',
        targetIdName: 'channelId',
    },
) {
    @ResolveField(() => ChannelEntity)
    target(
        @Parent() opinion: ChannelOpinionEntity,
        @Dataloader() dataloader: OpinionTargetDataloader,
    ) {
        return dataloader.load(opinion.id);
    }
}
