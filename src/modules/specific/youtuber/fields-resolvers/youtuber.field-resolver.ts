import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { OpinionsDataloader } from 'modules/generic/opinion/opinion.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { Skip1MorePipe } from 'pipes/skip-1-more.pipe';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';
import { YoutuberEntity } from '../entities/youtuber.entity';
import {
    YoutuberContentDataloader,
    YoutuberOpinionsTargetDataloader,
    YoutuberRevisionsDataloader,
} from '../youtuber.dataloader';

@Resolver(() => YoutuberEntity)
export class YoutuberFieldResolver {
    @ResolveField(() => [YoutuberRevisionEntity])
    revisions(
        @Parent() youtuber: YoutuberEntity,
        @Args('page', Skip1MorePipe) page: PageInput,
        @Dataloader() dataloader: YoutuberRevisionsDataloader,
    ): Promise<YoutuberRevisionEntity[]> {
        return dataloader.load({ id: youtuber.id, page });
    }

    @ResolveField(() => YoutuberRevisionEntity)
    newestContent(
        @Parent() youtuber: YoutuberEntity,
        @Dataloader() dataloader: YoutuberContentDataloader,
    ): Promise<YoutuberRevisionEntity> {
        return dataloader.load(youtuber.id);
    }

    @ResolveField(() => [OpinionEntity])
    async opinions(
        @Parent() youtuber: YoutuberEntity,
        @Args('page') page: PageInput,
        @Dataloader()
        opinionsTargetdataloader: YoutuberOpinionsTargetDataloader,
        @Dataloader() opinionsDataloader: OpinionsDataloader,
    ): Promise<OpinionEntity[]> {
        const { id } = await opinionsTargetdataloader.load(youtuber.id);

        return opinionsDataloader.load({
            id,
            page,
        });
    }
}
