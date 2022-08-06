import { HideField, ObjectType } from '@nestjs/graphql';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, ManyToOne } from 'typeorm';
import { ChannelEntity } from './channel.entity';

@Entity()
@ObjectType('ChannelOpinion')
export class ChannelOpinionEntity extends OpinionEntity {
    @ManyToOne(() => ChannelEntity)
    @HideField()
    target: ChannelEntity;
}
