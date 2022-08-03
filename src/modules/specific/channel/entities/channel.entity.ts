import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ChannelRevisionEntity } from './channel-revision.entity';

@ObjectType()
@Entity()
export class ChannelEntity {
    @PrimaryColumn()
    ytId: string;

    @Field({
        name: 'lastSyncWithYT',
    })
    @Column()
    lastRefetch: Date;

    @OneToMany(() => ChannelRevisionEntity, (revision) => revision.channel)
    @HideField()
    newestContent: ChannelRevisionEntity;
}
