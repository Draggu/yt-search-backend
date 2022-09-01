import { HideField, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ChannelRevisionProposalCommonEntity } from './channel-revision-proposal-common.entity';
import { ChannelEntity } from './channel.entity';

@Entity()
@ObjectType('ChannelRevision')
export class ChannelRevisionEntity extends ChannelRevisionProposalCommonEntity {
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
    @JoinColumn({ name: 'originOfId' })
    @HideField()
    originOf?: ChannelRevisionEntity;
}
