import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChannelEntity, ChannelRevisionEntity])],
    providers: [ChannelResolver, ChannelService],
})
export class ChannelModule {}
