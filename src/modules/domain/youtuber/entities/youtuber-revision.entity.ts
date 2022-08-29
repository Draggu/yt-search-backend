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

    @Column({
        default: () => 'NOW()',
    })
    editedAt: Date;

    @Column()
    name: string;

    @Column()
    realName?: string;

    @Column()
    birthday?: Date;

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
