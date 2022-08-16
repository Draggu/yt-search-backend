import { HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { YoutuberRevisionProposalEntity } from './youtuber-revision.entity';

@ObjectType('YoutuberProposal')
@Entity()
export class YoutuberProposalEntity extends YoutuberRevisionProposalEntity {
    @Column({ default: false })
    @HideField()
    isRejected: boolean;
}
