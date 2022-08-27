import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { HideEntity } from './entities/hide.entity';

@Injectable()
export class HideAuthorDataloader extends RelationDataloader(
    HideEntity,
    'id',
    'editedBy',
) {}

@Injectable()
export class HidesDataloader extends RelationPaginatedDataloader(
    HideEntity,
    'target',
    {
        column: 'editedAt',
        order: 'DESC',
    },
) {}
