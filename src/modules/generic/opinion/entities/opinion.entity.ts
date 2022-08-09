import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Check,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

@ObjectType({
    isAbstract: true,
})
@Check('stars > 0 AND stars <= 10')
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
    })
    @Field(() => Int, {
        description: 'integer in range 1-10',
    })
    stars: number;

    @ManyToOne(() => UserEntity)
    @HideField()
    author?: UserEntity;

    @RelationId((opinion: OpinionEntity) => opinion.author)
    @HideField()
    authorId?: string;
}
