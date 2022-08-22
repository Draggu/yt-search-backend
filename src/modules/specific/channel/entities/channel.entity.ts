import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { ChannelOpinionEntity } from './channel-opinion.entity';
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

    @OneToMany(() => ChannelOpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: ChannelOpinionEntity[];
}
