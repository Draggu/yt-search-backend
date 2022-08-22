import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { Skip1MorePipe } from 'pipes/skip-1-more.pipe';
import {
    ChannelContentDataloader,
    ChannelOpinionsDataloader,
    ChannelRevisionsDataloader,
} from '../channel.dataloader';
import { ChannelOpinionEntity } from '../entities/channel-opinion.entity';
import { ChannelRevisionEntity } from '../entities/channel-revision.entity';
import { ChannelEntity } from '../entities/channel.entity';

@Resolver(() => ChannelEntity)
export class ChannelFieldResolver {
    @ResolveField(() => [ChannelRevisionEntity])
    revisions(
        @Parent() channel: ChannelEntity,
        @Args('page', Skip1MorePipe) page: PageInput,
        @Dataloader() dataloader: ChannelRevisionsDataloader,
    ): Promise<ChannelRevisionEntity[]> {
        return dataloader.load({ id: channel.ytId, page });
    }

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
        @Args('page') page: PageInput,
        @Dataloader() dataloader: ChannelOpinionsDataloader,
    ): Promise<ChannelOpinionEntity[]> {
        return dataloader.load({ id: channel.ytId, page });
    }
}
