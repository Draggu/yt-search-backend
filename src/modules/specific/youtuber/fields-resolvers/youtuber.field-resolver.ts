import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { YoutuberContentDataloader } from '../dataloaders/youtuber-content.dataloader';
import { YoutuberOpinionsDataloader } from '../dataloaders/youtuber-opinions.dataloader';
import { YoutuberOpinionEntity } from '../entities/youtuber-opinion.entity';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';
import { YoutuberEntity } from '../entities/youtuber.entity';

@Resolver(() => YoutuberEntity)
export class YoutuberFieldResolver {
    @ResolveField(() => YoutuberRevisionEntity)
    content(
        @Parent() youtuber: YoutuberEntity,
        @Dataloader() dataloader: YoutuberContentDataloader,
    ): Promise<YoutuberRevisionEntity> {
        return dataloader.load(youtuber.id);
    }

    @ResolveField(() => [YoutuberOpinionEntity])
    opinions(
        @Parent() youtuber: YoutuberEntity,
        @Dataloader() dataloader: YoutuberOpinionsDataloader,
    ): Promise<YoutuberOpinionEntity[]> {
        return dataloader.load(youtuber.id);
    }
}
