import { Injectable } from '@nestjs/common';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { CategoriesDataloader } from 'modules/specific/categorie/categories.dataloader';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleAuthorDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'author',
) {}

@Injectable()
export class ArticleContentDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'revisions',
) {}

@Injectable()
export class ArticleOpinionsDataloader extends RelationDataloader(
    ArticleEntity,
    'id',
    'opinions',
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
