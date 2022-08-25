import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelRevisionsDataloader extends RelationPaginatedDataloader(
    ChannelRevisionEntity,
    'channelId',
    {
        column: 'editedAt',
        order: 'DESC',
    },
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
@Injectable()
export class ChannelContentDataloader extends RelationDataloader(
    ChannelEntity,
    'ytId',
    'lastRevision',
) {}
