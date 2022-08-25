import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Check,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OpinionTargetEntity } from './opinion-target.entity';

@ObjectType()
@Entity()
@Check('stars > 0 AND stars <= 10')
export class OpinionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => OpinionTargetEntity)
    @HideField()
    target: OpinionTargetEntity;

    @Column({
        nullable: true,
    })
    content?: string;

    @Column({
        default: () => 'NOW()',
    })
    createdAt: Date;

    @Column({
        nullable: false,
        type: 'smallint',
    })
    @Field(() => Int, {
        description: 'integer in range 1-10',
    })
    stars: number;

    @ManyToOne(() => UserEntity)
    @HideField()
    author?: UserEntity;
}
