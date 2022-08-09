import { Injectable } from '@nestjs/common';
import { CategoriesDataloader } from 'modules/specific/categorie/dataloaders/categories.dataloader';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';

@Injectable()
export class YoutuberRevisionCategoriesDataloader extends CategoriesDataloader<
    typeof YoutuberRevisionEntity
> {
    Entity = YoutuberRevisionEntity;
}
