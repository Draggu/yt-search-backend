import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { CategorieEntity } from 'modules/domain/categorie/entities/categorie.entity';
import { MentionsList } from 'modules/domain/markdown-mention/types';
import {
    SocialMedia,
    SocialMediaObject,
} from 'modules/domain/social-media/dto/social-media.input';
import { socialMediaSerializeMiddleware } from 'modules/domain/social-media/middlewares/serialize.middleware';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
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

    @Column({
        default: () => 'NOW()',
    })
    editedAt: Date;

    @Column()
    content: string;

    @Column('simple-json')
    @HideField()
    mentions: MentionsList;

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
    @JoinColumn()
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
