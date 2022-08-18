import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { YoutuberOpinionEntity } from '../entities/youtuber-opinion.entity';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';
import { YoutuberEntity } from '../entities/youtuber.entity';
import {
    YoutuberContentDataloader,
    YoutuberOpinionsDataloader,
} from '../youtuber.dataloader';

@Resolver(() => YoutuberEntity)
export class YoutuberFieldResolver {
    @ResolveField(() => [YoutuberRevisionEntity])
    content(
        @Parent() youtuber: YoutuberEntity,
        @Args('page') page: PageInput,
        @Dataloader() dataloader: YoutuberContentDataloader,
    ): Promise<YoutuberRevisionEntity[]> {
        return dataloader.load({ id: youtuber.id, page });
    }

    @ResolveField(() => [YoutuberOpinionEntity])
    opinions(
        @Parent() youtuber: YoutuberEntity,
        @Args('page') page: PageInput,
        @Dataloader() dataloader: YoutuberOpinionsDataloader,
    ): Promise<YoutuberOpinionEntity[]> {
        return dataloader.load({ id: youtuber.id, page });
    }
}
