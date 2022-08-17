import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
    SocialMedia,
    SocialMediaObject,
} from 'modules/generic/social-media/dto/social-media.input';
import { socialMediaSerializeMiddleware } from 'modules/generic/social-media/middlewares/serialize.middleware';
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
import { ChannelEntity } from './channel.entity';

@ObjectType({
    isAbstract: true,
})
export class ChannelRevisionProposalEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @ManyToOne(() => UserEntity, {
        nullable: false,
    })
    @HideField()
    editedBy: UserEntity;

    @Column()
    description: string;

    @Column('simple-json')
    @Field(() => [SocialMediaObject], {
        middleware: [socialMediaSerializeMiddleware],
    })
    socialMedia: Record<SocialMedia, string>;

    @ManyToMany(() => CategorieEntity)
    @JoinTable()
    @HideField()
    categories: CategorieEntity[];
}

@Entity()
@ObjectType('ChannelRevision')
export class ChannelRevisionEntity extends ChannelRevisionProposalEntity {
    @ManyToOne(() => ChannelEntity)
    @HideField()
    channel: ChannelEntity;

    @ManyToOne(() => UserEntity, {
        nullable: false,
    })
    @HideField()
    acceptedBy: UserEntity;

    @OneToOne(() => ChannelRevisionEntity, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    @HideField()
    originalEdit: ChannelRevisionEntity | null;
}
