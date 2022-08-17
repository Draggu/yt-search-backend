import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleHideEntity } from './article-hide.entity';
import { ArticleOpinionEntity } from './article-opinion.entity';
import { ArticleRevisionEntity } from './article-revision.entity';

@ObjectType()
@Entity()
export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({
        default: () => 'NOW()',
    })
    createdAt: Date;

    @ManyToOne(() => UserEntity)
    @HideField()
    author: UserEntity;

    @OneToMany(() => ArticleRevisionEntity, (revision) => revision.article, {
        cascade: true,
        nullable: false,
    })
    @HideField()
    revisions: ArticleRevisionEntity[];

    @OneToMany(() => ArticleHideEntity, (hide) => hide.article, {
        nullable: false,
    })
    @HideField()
    hides: ArticleHideEntity[];

    @OneToMany(() => ArticleOpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: ArticleOpinionEntity[];
}
