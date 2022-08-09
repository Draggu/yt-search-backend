import { Injectable } from '@nestjs/common';
import { CategoriesDataloader } from 'modules/specific/categorie/dataloaders/categories.dataloader';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';

@Injectable()
export class ArticleRevisionCategoriesDataloader extends CategoriesDataloader<
    typeof ArticleRevisionEntity
> {
    Entity = ArticleRevisionEntity;
}
