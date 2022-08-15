import { Injectable } from '@nestjs/common';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelContentDataloader extends RelationDataloader(
    ChannelEntity,
    'ytId',
    'revisions',
) {}

@Injectable()
export class ChannelOpinionsDataloader extends RelationDataloader(
    ChannelEntity,
    'ytId',
    'opinions',
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
