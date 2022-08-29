import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/domain/categorie/entities/categorie.entity';
import { MentionEntity } from 'modules/domain/markdown-mention/entities/entity.mention';
import { MentionDataloader } from 'modules/domain/markdown-mention/mention.dataloader';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Dataloader } from 'modules/infrastructure/dataloader/dataloader.decorator';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';
import {
    YoutuberRevisionCategoriesDataloader,
    YoutuberRevisionEditorDataloader,
} from '../youtuber.dataloader';

@Resolver(() => YoutuberRevisionEntity)
export class YoutuberRevisionFieldResolver {
    @ResolveField(() => UserEntity)
    editedBy(
        @Parent() youtuberRevision: YoutuberRevisionEntity,
        @Dataloader() dataloader: YoutuberRevisionEditorDataloader,
    ): Promise<UserEntity> {
        return dataloader.load(youtuberRevision.id);
    }

    @ResolveField(() => [CategorieEntity])
    categories(
        @Parent() youtuberRevision: YoutuberRevisionEntity,
        @Dataloader() dataloader: YoutuberRevisionCategoriesDataloader,
    ): Promise<CategorieEntity[]> {
        return dataloader.load(youtuberRevision.id);
    }

    @ResolveField(() => MentionEntity)
    mentions(
        @Parent() youtuberRevision: YoutuberRevisionEntity,
        @Dataloader() dataloader: MentionDataloader,
    ): Promise<MentionEntity> {
        return dataloader.load(youtuberRevision.mentions);
    }
}
