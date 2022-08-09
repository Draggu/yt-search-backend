import { Injectable } from '@nestjs/common';
import { CategoriesDataloader } from 'modules/specific/categorie/dataloaders/categories.dataloader';
import { ChannelRevisionEntity } from '../entities/channel-revision.entity';

@Injectable()
export class ChannelRevisionCategoriesDataloader extends CategoriesDataloader<
    typeof ChannelRevisionEntity
> {
    Entity = ChannelRevisionEntity;
}
