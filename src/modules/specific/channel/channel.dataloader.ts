import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { ChannelOpinionEntity } from './entities/channel-opinion.entity';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';

@Injectable()
export class ChannelContentDataloader extends RelationPaginatedDataloader(
    ChannelRevisionEntity,
    'channelId',
    {
        column: 'editedAt',
        order: 'DESC',
    },
) {}

@Injectable()
export class ChannelOpinionsDataloader extends RelationPaginatedDataloader(
    ChannelOpinionEntity,
    'targetId',
    { column: 'createdAt', order: 'DESC' },
) {}

@Injectable()
export class ChannelRevisionCategoriesDataloader extends CategoriesDataloader(
    ChannelRevisionEntity,
) {}

@Injectable()
export class ChannelRevisionEditorDataloader extends RelationDataloader(
    ChannelRevisionEntity,
    'id',
    'editedBy',
) {}
