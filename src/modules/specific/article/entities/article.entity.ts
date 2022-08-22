import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
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

    @OneToOne(() => ArticleRevisionEntity)
    @JoinColumn()
    @HideField()
    lastRevision: ArticleRevisionEntity;

    @OneToMany(() => ArticleRevisionEntity, (revision) => revision.article, {
        cascade: true,
        nullable: false,
    })
    @HideField()
    revisions: ArticleRevisionEntity[];

    @OneToMany(() => ArticleHideEntity, (hide) => hide.article, {
        cascade: true,
        nullable: false,
    })
    @HideField()
    hides: ArticleHideEntity[];

    @OneToMany(() => ArticleOpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: ArticleOpinionEntity[];
}
