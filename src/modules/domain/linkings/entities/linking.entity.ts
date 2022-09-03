import { HideField } from '@nestjs/graphql';
import { ChannelEntity } from 'modules/domain/channel/entities/channel.entity';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { YoutuberEntity } from 'modules/domain/youtuber/entities/youtuber.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LinkingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        default: () => 'NOW()',
    })
    createdAt: Date;

    @ManyToOne(() => YoutuberEntity)
    @JoinColumn()
    @HideField()
    youtuber: YoutuberEntity;

    @ManyToOne(() => ChannelEntity)
    @JoinColumn()
    @HideField()
    channel: ChannelEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    @HideField()
    acceptedBy: UserEntity;
}
