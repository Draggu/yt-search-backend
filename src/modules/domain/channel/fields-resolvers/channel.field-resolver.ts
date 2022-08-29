import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { OpinionEntity } from 'modules/domain/opinion/entities/opinion.entity';
import { OpinionsDataloader } from 'modules/domain/opinion/opinion.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { Skip1MorePipe } from 'pipes/skip-1-more.pipe';
import {
    ChannelContentDataloader,
    ChannelOpinionsTargetDataloader,
    ChannelRevisionsDataloader,
} from '../channel.dataloader';
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
    newestContent(
        @Parent() channel: ChannelEntity,
        @Dataloader() dataloader: ChannelContentDataloader,
    ): Promise<ChannelRevisionEntity> {
        return dataloader.load(channel.ytId);
    }

    @ResolveField(() => [OpinionEntity])
    opinions(
        @Parent() channel: ChannelEntity,
        @Args('page') page: PageInput,
        @Dataloader() opinionsTargetdataloader: ChannelOpinionsTargetDataloader,
        @Dataloader() opinionsDataloader: OpinionsDataloader,
        @Auth({
            optional: true,
        })
        currentUser?: CurrentUser,
    ): Promise<OpinionEntity[]> {
        return opinionsTargetdataloader.load(channel.ytId).then(({ id }) =>
            opinionsDataloader.load({
                id,
                page,
                currentUser,
            }),
        );
    }
}
