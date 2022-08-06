import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { ChannelOpinionEntity } from './entities/channel-opinion.entity';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelOpinionFieldResolver } from './fields-resolvers/channel-opinion-channel-fields.resolver';

@Module({
    imports: [
        OpinionModule.forFeature(ChannelOpinionEntity, 'id', {
            methodName: 'commentChannel',
            tragetIdName: 'channelId',
        }),
        TypeOrmModule.forFeature([ChannelEntity, ChannelRevisionEntity]),
    ],
    providers: [ChannelResolver, ChannelOpinionFieldResolver, ChannelService],
})
export class ChannelModule {}
