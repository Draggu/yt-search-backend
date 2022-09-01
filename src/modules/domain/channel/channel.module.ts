import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/domain/opinion/opinion.module';
import { YoutubeAPI } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { ProposalModule } from '../proposal/proposal.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { ChannelProposalEntity } from './entities/channel-proposal.entity';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelProposalFieldResolver } from './fields-resolvers/channel-proposal.field-resolver';
import { ChannelRevisionFieldResolver } from './fields-resolvers/channel-revision.field-resolver';
import { ChannelFieldResolver } from './fields-resolvers/channel.field-resolver';
import { RefetchChannelScheduler } from './schedulers/refetch-channel.scheduler';

@Module({
    imports: [
        ProposalModule,
        OpinionModule,
        TypeOrmModule.forFeature([
            ChannelEntity,
            ChannelProposalEntity,
            ChannelRevisionEntity,
        ]),
        YoutubeAPI,
    ],
    providers: [
        RefetchChannelScheduler,
        ChannelResolver,
        ChannelFieldResolver,
        ChannelRevisionFieldResolver,
        ChannelService,
        ChannelProposalFieldResolver,
    ],
})
export class ChannelModule {}
