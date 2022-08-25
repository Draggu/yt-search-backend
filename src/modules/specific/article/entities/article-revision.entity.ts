import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { MentionsList } from 'modules/generic/markdown-mention/types';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { ArticleEntity } from './article.entity';

@ObjectType()
@Entity()
export class ArticleRevisionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => ArticleEntity)
    @JoinColumn()
    @HideField()
    article: ArticleEntity;

    @RelationId((revision: ArticleRevisionEntity) => revision.article)
    @HideField()
    articleId: string;

    @Column({
        default: () => 'NOW()',
    })
    editedAt: Date;

    @ManyToMany(() => CategorieEntity)
    @JoinTable()
    @HideField()
    categories: CategorieEntity[];

    @ManyToOne(() => UserEntity)
    @HideField()
    editedBy: UserEntity;

    @Column()
    @Index('article_revision_fts_idx', {
        synchronize: false,
    })
    content: string;

    @Column()
    title: string;

    @Column('simple-json')
    @HideField()
    mentions: MentionsList;
}
