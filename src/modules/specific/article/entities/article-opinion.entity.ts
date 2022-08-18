import { HideField, ObjectType } from '@nestjs/graphql';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
@ObjectType('ArticleOpinion')
export class ArticleOpinionEntity extends OpinionEntity {
    @ManyToOne(() => ArticleEntity)
    @JoinColumn()
    @HideField()
    target: ArticleEntity;

    @RelationId((opinion: ArticleOpinionEntity) => opinion.target)
    targetId: string;
}
