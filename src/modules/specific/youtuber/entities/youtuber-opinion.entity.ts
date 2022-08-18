import { HideField, ObjectType } from '@nestjs/graphql';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { YoutuberEntity } from './youtuber.entity';

@Entity()
@ObjectType('YoutuberOpinion')
export class YoutuberOpinionEntity extends OpinionEntity {
    @ManyToOne(() => YoutuberEntity)
    @HideField()
    target: YoutuberEntity;

    @RelationId((opinion: YoutuberOpinionEntity) => opinion.target)
    targetId: string;
}
