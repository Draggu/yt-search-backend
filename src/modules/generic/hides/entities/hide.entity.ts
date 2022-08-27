import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HideTargetEntity } from './hide-target.entity';

@Entity()
@ObjectType()
export class HideEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => HideTargetEntity)
    @HideField()
    target: HideTargetEntity;

    @Column({
        default: () => 'NOW()',
    })
    editedAt: Date;

    @Column({
        default: false,
    })
    isHiden: boolean;

    @Column({
        nullable: true,
    })
    reason?: string;

    @ManyToOne(() => UserEntity)
    @HideField()
    editedBy: UserEntity;
}
