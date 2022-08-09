import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
} from 'typeorm';
import { YoutuberEntity } from './youtuber.entity';

@Entity()
@Tree('closure-table')
@ObjectType()
export class YoutuberRevisionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => YoutuberEntity)
    @HideField()
    youtuber: YoutuberEntity;

    @ManyToOne(() => UserEntity)
    @HideField()
    editedBy: UserEntity;

    @Column()
    name: string;

    @Column()
    realName?: string;

    @Column()
    birthday?: Date;

    @Column()
    description: string;

    @ManyToMany(() => CategorieEntity)
    @HideField()
    categories: CategorieEntity[];
}
