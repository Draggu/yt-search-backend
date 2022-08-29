import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { HideTargetEntity } from 'modules/generic/hides/entities/hide-target.entity';
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

    @OneToOne(() => ArticleRevisionEntity, {
        nullable: true,
    })
    @JoinColumn()
    @HideField()
    lastRevision: ArticleRevisionEntity;

    @OneToMany(() => ArticleRevisionEntity, (revision) => revision.article)
    @HideField()
    revisions: ArticleRevisionEntity[];

    @OneToOne(() => HideTargetEntity, { cascade: true })
    @JoinColumn()
    @HideField()
    hideTarget: HideTargetEntity;

    @OneToOne(() => OpinionTargetEntity, { cascade: true })
    @JoinColumn()
    @HideField()
    opinionTarget: OpinionTargetEntity;
}
