import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { OpinionEntity } from './entities/opinion.entity';

@Injectable()
export class OpinionAuthorDataloader extends RelationDataloader(
    OpinionEntity,
    'id',
    'author',
) {}

@Injectable()
export class OpinionsDataloader extends RelationPaginatedDataloader(
    OpinionEntity,
    'target',
    {
        column: 'createdAt',
        order: 'DESC',
    },
) {}
