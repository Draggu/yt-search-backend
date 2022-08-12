import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelEntity } from './channel.entity';

@ObjectType()
@Entity()
export class ChannelRevisionEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => ChannelEntity)
    @HideField()
    channel: ChannelEntity;

    @ManyToOne(() => UserEntity)
    @HideField()
    editedBy: UserEntity;

    @Column()
    description: string;

    @ManyToMany(() => CategorieEntity)
    @HideField()
    categories: CategorieEntity[];

    @OneToOne(() => ChannelRevisionEntity)
    @HideField()
    previous?: ChannelRevisionEntity;
}
