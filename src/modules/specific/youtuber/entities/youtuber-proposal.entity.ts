import { HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { YoutuberRevisionProposalEntity } from './youtuber-revision.entity';
import { YoutuberEntity } from './youtuber.entity';

@ObjectType('YoutuberProposal')
@Entity()
export class YoutuberProposalEntity extends YoutuberRevisionProposalEntity {
    @Column({ default: false })
    @HideField()
    isRejected: boolean;

    @ManyToOne(() => YoutuberEntity)
    @JoinColumn()
    @HideField()
    youtuber?: YoutuberEntity;
}
