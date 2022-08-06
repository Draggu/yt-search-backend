import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class YoutuberEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    name: string;

    @Column()
    realName?: string;

    @Column()
    birthday?: Date;

    @Column()
    description: string;
}
