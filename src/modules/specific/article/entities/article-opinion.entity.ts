import { HideField, ObjectType } from '@nestjs/graphql';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
@ObjectType('ArticleOpinion')
export class ArticleOpinionEntity extends OpinionEntity {
    @ManyToOne(() => ArticleEntity)
    @HideField()
    target: ArticleEntity;
}
