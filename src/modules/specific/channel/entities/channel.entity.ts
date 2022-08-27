import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { OpinionTargetEntity } from 'modules/generic/opinion/entities/opinion-target.entity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { ChannelRevisionEntity } from './channel-revision.entity';

@ObjectType('Channel')
@Entity()
export class ChannelEntity {
    @PrimaryColumn()
    @Field(() => ID)
    ytId: string;

    @Field({
        name: 'lastSyncWithYT',
    })
    @Column({
        default: () => 'NOW()',
    })
    lastRefetch: Date;

    @Column()
    name: string;

    @OneToOne(() => ChannelRevisionEntity)
    @JoinColumn()
    @HideField()
    lastRevision: ChannelRevisionEntity;

    @OneToMany(() => ChannelRevisionEntity, (revision) => revision.channel, {
        cascade: true,
    })
    @HideField()
    revisions: ChannelRevisionEntity[];

    @OneToOne(() => OpinionTargetEntity, { cascade: true, eager: true })
    @JoinColumn()
    @HideField()
    opinionTarget: OpinionTargetEntity;
}
