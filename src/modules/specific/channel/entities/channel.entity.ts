import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ChannelOpinionEntity } from './channel-opinion.entity';
import { ChannelRevisionEntity } from './channel-revision.entity';

@ObjectType()
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

    @OneToMany(() => ChannelRevisionEntity, (revision) => revision.channel)
    @HideField()
    newestContent: ChannelRevisionEntity;

    @OneToMany(() => ChannelOpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: ChannelOpinionEntity[];
}
