import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OpinionTargetDataloader } from 'modules/generic/opinion/dataloaders/opinion-target.dataloader';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { YoutuberOpinionEntity } from '../entities/youtuber-opinion.entity';
import { YoutuberEntity } from '../entities/youtuber.entity';

@Resolver(() => YoutuberOpinionEntity)
export class YoutuberOpinionFieldResolver {
    @ResolveField(() => YoutuberEntity)
    target(
        @Parent() opinion: YoutuberOpinionEntity,
        @Dataloader() dataloader: OpinionTargetDataloader,
    ) {
        return dataloader.load(opinion.id);
    }
}
