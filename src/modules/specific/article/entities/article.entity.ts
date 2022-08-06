import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleRevisionEntity } from './article-revision.entity';

@ObjectType()
@Entity()
export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    createdAt: Date;

    @ManyToOne(() => UserEntity)
    @HideField()
    author: UserEntity;

    @OneToMany(() => ArticleRevisionEntity, (revision) => revision.article)
    @HideField()
    newestContent: ArticleRevisionEntity;
}
