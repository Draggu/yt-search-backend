import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { OpinionTargetEntity } from 'modules/generic/opinion/entities/opinion-target.entity';
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

    @OneToOne(() => OpinionTargetEntity, { cascade: true, eager: true })
    @HideField()
    opinionTarget: OpinionTargetEntity;
}
