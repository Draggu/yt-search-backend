import { HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { YoutuberRevisionProposalCommonEntity } from './youtuber-revision-proposal-common.entity';
import { YoutuberEntity } from './youtuber.entity';

@ObjectType('YoutuberProposal')
@Entity()
export class YoutuberProposalEntity extends YoutuberRevisionProposalCommonEntity {
    @Column({ default: false })
    @HideField()
    isRejected: boolean;

    @ManyToOne(() => YoutuberEntity)
    @JoinColumn()
    @HideField()
    youtuber?: YoutuberEntity;
}
