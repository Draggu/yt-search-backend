import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { YoutuberOpinionEntity } from './entities/youtuber-opinion.entity';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';

@Injectable()
export class YoutuberContentDataloader extends RelationPaginatedDataloader(
    YoutuberRevisionEntity,
    'youtuberId',
    {
        column: 'editedAt',
        order: 'DESC',
    },
) {}

@Injectable()
export class YoutuberOpinionsDataloader extends RelationPaginatedDataloader(
    YoutuberOpinionEntity,
    'targetId',
    {
        column: 'createdAt',
        order: 'DESC',
    },
) {}

@Injectable()
export class YoutuberRevisionCategoriesDataloader extends CategoriesDataloader(
    YoutuberRevisionEntity,
) {}

@Injectable()
export class YoutuberRevisionEditorDataloader extends RelationDataloader(
    YoutuberRevisionEntity,
    'id',
    'editedBy',
) {}
