import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { ArticleEntity } from './article.entity';

@ObjectType()
@Entity()
@Tree('closure-table')
export class ArticleRevisionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => ArticleEntity)
    @HideField()
    article: ArticleEntity;

    @Column()
    editedAt: Date;

    @Column({
        default: false,
    })
    isHiden: boolean;

    //TODO list all editors
    @ManyToOne(() => UserEntity)
    editedBy: UserEntity;

    @Column()
    @Index() //TODO Gin tsvector_ops
    content: string;

    @TreeParent()
    @HideField()
    previous?: ArticleRevisionEntity;

    @TreeChildren()
    @HideField()
    next?: ArticleRevisionEntity;
}
