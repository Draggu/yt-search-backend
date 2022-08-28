import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
    Unique,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique('unique_name_per_level', ['name', 'parent'])
@Tree('nested-set')
export class CategorieEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    name: string;

    @TreeChildren()
    @HideField()
    children: CategorieEntity[];

    @TreeParent({ onDelete: 'CASCADE' })
    @HideField()
    parent: CategorieEntity;

    @Field(() => ID)
    parentId?: string | null;
}
