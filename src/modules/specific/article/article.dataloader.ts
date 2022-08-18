import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { ArticleOpinionEntity } from './entities/article-opinion.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleAuthorDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'author',
) {}

@Injectable()
export class ArticleContentDataloader extends RelationPaginatedDataloader(
    ArticleRevisionEntity,
    'articleId',
    {
        column: 'editedAt',
        order: 'DESC',
    },
) {}

@Injectable()
export class ArticleOpinionsDataloader extends RelationPaginatedDataloader(
    ArticleOpinionEntity,
    'targetId',
    {
        column: 'createdAt',
        order: 'DESC',
    },
) {}

@Injectable()
export class ArticleRevisionCategoriesDataloader extends CategoriesDataloader(
    ArticleRevisionEntity,
) {}

@Injectable()
export class ArticleRevisionEditorDataloader extends RelationDataloader(
    ArticleRevisionEntity,
    'id',
    'editedBy',
) {}
