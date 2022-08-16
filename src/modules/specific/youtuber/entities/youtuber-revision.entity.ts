import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/specific/categorie/entities/categorie.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { YoutuberEntity } from './youtuber.entity';

@ObjectType({
    isAbstract: true,
})
export class YoutuberRevisionProposalEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

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
    @JoinTable()
    @HideField()
    categories: CategorieEntity[];
}
@Entity()
@ObjectType()
export class YoutuberRevisionEntity extends YoutuberRevisionProposalEntity {
    @ManyToOne(() => YoutuberEntity)
    @HideField()
    youtuber: YoutuberEntity;

    @ManyToOne(() => UserEntity, {
        nullable: false,
    })
    @HideField()
    acceptedBy: UserEntity;

    @OneToOne(() => YoutuberRevisionEntity, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    @HideField()
    originalEdit: YoutuberRevisionEntity | null;
}
