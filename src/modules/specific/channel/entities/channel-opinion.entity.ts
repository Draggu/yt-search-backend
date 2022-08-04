import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { Entity, ManyToOne } from 'typeorm';
import { ChannelEntity } from './channel.entity';

@Entity()
export class ChannelOpinionEntity extends OpinionEntity {
    @ManyToOne(() => ChannelEntity)
    target: ChannelEntity;
}
