import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@ObjectType('Opinion')
export class OpinionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({
        nullable: true,
    })
    content?: string;

    @Column({
        nullable: false,
        type: 'smallint',
        length: 10,
    })
    stars: number;

    @ManyToOne(() => UserEntity)
    @HideField()
    author?: UserEntity;

    @RelationId((opinion: OpinionEntity) => opinion.author)
    @HideField()
    authorId?: string;
}
