import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
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

    @OneToOne(() => ArticleEntity, (article) => article.newestContent)
    @JoinColumn()
    @HideField()
    articleNewestContentBackward?: ArticleEntity;

    @Column({
        default: () => 'NOW()',
    })
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
    @Index()
    content: string;

    @OneToOne(() => ArticleRevisionEntity)
    @HideField()
    previous?: ArticleRevisionEntity;
}
