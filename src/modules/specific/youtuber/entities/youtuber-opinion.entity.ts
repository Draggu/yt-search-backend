import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, ManyToOne } from 'typeorm';
import { YoutuberEntity } from './youtuber.entity';

@Entity()
export class YoutuberOpinionEntity extends OpinionEntity {
    @ManyToOne(() => YoutuberEntity)
    target: YoutuberEntity;
}
