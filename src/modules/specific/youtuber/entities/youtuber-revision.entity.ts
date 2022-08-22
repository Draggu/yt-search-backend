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
    RelationId,
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

    @RelationId((revision: YoutuberRevisionEntity) => revision.youtuber)
    youtuberId: string;

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
