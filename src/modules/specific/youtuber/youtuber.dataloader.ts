import { Injectable } from '@nestjs/common';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';
import { YoutuberEntity } from './entities/youtuber.entity';

@Injectable()
export class YoutuberContentDataloader extends RelationDataloader(
    YoutuberEntity,
    'id',
    'newestContent',
) {}

@Injectable()
export class YoutuberOpinionsDataloader extends RelationDataloader(
    YoutuberEntity,
    'id',
    'opinions',
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
