import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { YoutuberOpinionEntity } from './youtuber-opinion.entity';
import { YoutuberRevisionEntity } from './youtuber-revision.entity';

@ObjectType()
@Entity()
export class YoutuberEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @OneToMany(() => YoutuberRevisionEntity, (revision) => revision.youtuber)
    @HideField()
    revisions: YoutuberRevisionEntity[];

    @OneToMany(() => YoutuberOpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: YoutuberOpinionEntity[];
}
