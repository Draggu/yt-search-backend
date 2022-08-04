import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
export class ArticleOpinionEntity extends OpinionEntity {
    @ManyToOne(() => ArticleEntity)
    target: ArticleEntity;
}
