import { Injectable } from '@nestjs/common';
import { RelationPaginatedDataloader } from 'common/dataloaders/relation-paginated.dataloader';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/domain/categorie/categories.dataloader';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleAuthorDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'author',
) {}

@Injectable()
export class ArticleRevisionsDataloader extends RelationPaginatedDataloader(
    ArticleRevisionEntity,
    'article',
    {
        column: 'editedAt',
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

@Injectable()
export class ArticleContentDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'lastRevision',
) {}

@Injectable()
export class ArticleOpinionsTargetDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'opinionTarget',
) {}

@Injectable()
export class ArticleHidesTargetDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'hideTarget',
) {}
