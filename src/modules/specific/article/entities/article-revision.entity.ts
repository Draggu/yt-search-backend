import { ObjectType } from '@nestjs/graphql';
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
    id: string;

    @ManyToOne(() => ArticleEntity)
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
    previous?: ArticleRevisionEntity;

    @TreeChildren()
    next: ArticleRevisionEntity;
}
