import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    ManyToMany,
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

    @ManyToMany(() => CategorieEntity)
    @HideField()
    categories: CategorieEntity[];

    @ManyToOne(() => UserEntity)
    @HideField()
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
