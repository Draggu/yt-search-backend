import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/domain/categorie/categories.dataloader';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';
import { YoutuberEntity } from './entities/youtuber.entity';

@Injectable()
export class YoutuberRevisionsDataloader extends RelationPaginatedDataloader(
    YoutuberRevisionEntity,
    'youtuber',
    {
        column: 'editedAt',
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
@Injectable()
export class YoutuberContentDataloader extends RelationDataloader(
    YoutuberEntity,
    'id',
    'lastRevision',
) {}

@Injectable()
export class YoutuberOpinionsTargetDataloader extends RelationDataloader(
    YoutuberEntity,
    'id',
    'opinionTarget',
) {}
