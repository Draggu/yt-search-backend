import { HideField, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    RelationId,
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
    id: string;

    @Column()
    name: string;

    @TreeChildren()
    @HideField()
    children: CategorieEntity[];

    @TreeParent({ onDelete: 'CASCADE' })
    @HideField()
    parent: CategorieEntity;

    @RelationId((categorie: CategorieEntity) => categorie.parent)
    parentId?: string | null;
}
