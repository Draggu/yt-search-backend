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
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType({
    isAbstract: true,
})
export class YoutuberRevisionProposalCommonEntity {
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

    @Column({
        nullable: true,
    })
    realName?: string;

    @Column({
        nullable: true,
    })
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
