import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/domain/categorie/entities/categorie.entity';
import { MentionsList } from 'modules/domain/markdown-mention/types';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';

@ObjectType()
@Entity()
export class ArticleRevisionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => ArticleEntity, {
        cascade: true,
        nullable: false,
    })
    @JoinColumn()
    @HideField()
    article: ArticleEntity;

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
