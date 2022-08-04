import { Field, ID, ObjectType } from '@nestjs/graphql';
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
import { ChannelEntity } from './channel.entity';

@ObjectType()
@Entity()
@Tree('closure-table')
export class ChannelRevisionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => ChannelEntity)
    channel: ChannelEntity;

    //TODO @OneToMany(() => UserEntity)
    editedBy: UserEntity;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => CategorieEntity)
    categories: CategorieEntity[];
}
