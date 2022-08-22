import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { YoutuberOpinionEntity } from './youtuber-opinion.entity';
import { YoutuberRevisionEntity } from './youtuber-revision.entity';

@ObjectType()
@Entity()
export class YoutuberEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @OneToOne(() => YoutuberRevisionEntity)
    @JoinColumn()
    @HideField()
    lastRevision: YoutuberRevisionEntity;

    @OneToMany(() => YoutuberRevisionEntity, (revision) => revision.youtuber)
    @HideField()
    revisions: YoutuberRevisionEntity[];

    @OneToMany(() => YoutuberOpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: YoutuberOpinionEntity[];
}
