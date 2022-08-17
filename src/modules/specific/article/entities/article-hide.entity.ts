import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
@ObjectType()
export class ArticleHideEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => ArticleEntity)
    @JoinColumn()
    @HideField()
    article: ArticleEntity;

    @Column({
        default: () => 'NOW()',
    })
    editedAt: Date;

    @Column({
        default: false,
    })
    isHiden: boolean;

    @ManyToOne(() => UserEntity)
    @HideField()
    editedBy: UserEntity;
}
