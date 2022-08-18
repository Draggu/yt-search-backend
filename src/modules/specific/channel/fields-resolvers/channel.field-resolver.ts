import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
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
    @ResolveField(() => [ChannelRevisionEntity])
    content(
        @Parent() channel: ChannelEntity,
        @Args('page') page: PageInput,
        @Dataloader() dataloader: ChannelContentDataloader,
    ): Promise<ChannelRevisionEntity[]> {
        return dataloader.load({ id: channel.ytId, page });
    }

    @ResolveField(() => [ChannelOpinionEntity])
    opinions(
        @Parent() channel: ChannelEntity,
        @Args('page') page: PageInput,
        @Dataloader() dataloader: ChannelOpinionsDataloader,
    ): Promise<ChannelOpinionEntity[]> {
        return dataloader.load({ id: channel.ytId, page });
    }
}
