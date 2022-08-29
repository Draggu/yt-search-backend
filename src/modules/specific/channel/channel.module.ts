import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkdownMentionModule } from 'modules/generic/markdown-mention/markdown-mention.module';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { YoutubeAPI } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { CategorieModule } from '../categorie/categorie.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { ChannelProposalEntity } from './entities/channel-proposal.entity';
import {
    ChannelRevisionEntity,
    ChannelRevisionProposalEntity,
} from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelRevisionFieldResolver } from './fields-resolvers/channel-revision.field-resolver';
import { ChannelFieldResolver } from './fields-resolvers/channel.field-resolver';
import { RefetchChannelScheduler } from './schedulers/refetch-channel.scheduler';

@Module({
    imports: [
        CategorieModule,
        OpinionModule,
        TypeOrmModule.forFeature([
            ChannelEntity,
            ChannelProposalEntity,
            ChannelRevisionEntity,
            ChannelRevisionProposalEntity,
        ]),
        YoutubeAPI,
        MarkdownMentionModule,
    ],
    providers: [
        RefetchChannelScheduler,
        ChannelResolver,
        ChannelFieldResolver,
        ChannelRevisionFieldResolver,
        ChannelService,
    ],
})
export class ChannelModule {}
