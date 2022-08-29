import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { ChannelRevisionProposalEntity } from './channel-revision.entity';

@ObjectType('ChannelProposal')
@Entity()
export class ChannelProposalEntity extends ChannelRevisionProposalEntity {
    @Column({
        unique: true,
    })
    @Field(() => ID)
    ytId: string;

    @Column({ default: false })
    @HideField()
    isRejected: boolean;
}
