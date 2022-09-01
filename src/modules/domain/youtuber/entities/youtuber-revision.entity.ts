import { HideField, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { YoutuberRevisionProposalCommonEntity } from './youtuber-revision-proposal-common.entity';
import { YoutuberEntity } from './youtuber.entity';
@Entity()
@ObjectType()
export class YoutuberRevisionEntity extends YoutuberRevisionProposalCommonEntity {
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
    @JoinColumn({ name: 'originOfId' })
    @HideField()
    originOf?: YoutuberRevisionEntity;
}
