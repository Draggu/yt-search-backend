import { HideField, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';

@Entity()
@ObjectType('Opinion')
export class OpinionEntity {
    @PrimaryGeneratedColumn('uuid')
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
