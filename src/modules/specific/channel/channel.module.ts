import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { ChannelOpinionEntity } from './entities/channel-opinion.entity';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';

@Module({
    imports: [
        OpinionModule.forFeature(ChannelOpinionEntity, 'id', {
            methodName: 'commentChannel',
            tragetIdName: 'channelId',
        }),
        TypeOrmModule.forFeature([ChannelEntity, ChannelRevisionEntity]),
    ],
    providers: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
