import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OpinionTargetDataloader } from 'modules/generic/opinion/opinion.dataloader';
import { OpinionResolver } from 'modules/generic/opinion/opinion.resolver';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { YoutuberOpinionEntity } from '../entities/youtuber-opinion.entity';
import { YoutuberEntity } from '../entities/youtuber.entity';

@Resolver(() => YoutuberOpinionEntity)
export class YoutuberOpinionFieldResolver extends OpinionResolver(
    YoutuberOpinionEntity,
    {
        methodName: 'commentYoutuber',
        targetIdName: 'youtuberId',
    },
) {
    @ResolveField(() => YoutuberEntity)
    target(
        @Parent() opinion: YoutuberOpinionEntity,
        @Dataloader() dataloader: OpinionTargetDataloader,
    ) {
        return dataloader.load(opinion.id);
    }
}
