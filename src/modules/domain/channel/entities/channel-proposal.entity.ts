import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { ChannelRevisionProposalCommonEntity } from './channel-revision-proposal-common.entity';

@ObjectType('ChannelProposal')
@Entity()
export class ChannelProposalEntity extends ChannelRevisionProposalCommonEntity {
    @Column({
        unique: true,
    })
    @Field(() => ID)
    ytId: string;

    @Column({ default: false })
    @HideField()
    isRejected: boolean;
}
