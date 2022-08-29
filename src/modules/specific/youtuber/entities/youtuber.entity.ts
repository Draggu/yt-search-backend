import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { OpinionTargetEntity } from 'modules/generic/opinion/entities/opinion-target.entity';
import {
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
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

    @OneToOne(() => OpinionTargetEntity, { cascade: true })
    @JoinColumn()
    @HideField()
    opinionTarget: OpinionTargetEntity;
}
