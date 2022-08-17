import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { YoutubeAPI } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { ChannelOpinionEntity } from './entities/channel-opinion.entity';
import { ChannelProposalEntity } from './entities/channel-proposal.entity';
import {
    ChannelRevisionEntity,
    ChannelRevisionProposalEntity,
} from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelOpinionFieldResolver } from './fields-resolvers/channel-opinion.field-resolver';
import { ChannelRevisionFieldResolver } from './fields-resolvers/channel-revision.field-resolver';
import { ChannelFieldResolver } from './fields-resolvers/channel.field-resolver';

@Module({
    imports: [
        OpinionModule.forFeature(ChannelOpinionEntity),
        TypeOrmModule.forFeature([
            ChannelEntity,
            ChannelProposalEntity,
            ChannelRevisionEntity,
            ChannelRevisionProposalEntity,
            ChannelOpinionEntity,
        ]),
        YoutubeAPI,
    ],
    providers: [
        ChannelResolver,
        ChannelOpinionFieldResolver,
        ChannelFieldResolver,
        ChannelRevisionFieldResolver,
        ChannelService,
    ],
})
export class ChannelModule {}
