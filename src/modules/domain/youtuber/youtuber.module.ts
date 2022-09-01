import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/domain/opinion/opinion.module';
import { ProposalModule } from '../proposal/proposal.module';
import { YoutuberProposalEntity } from './entities/youtuber-proposal.entity';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberRevisionFieldResolver } from './fields-resolvers/youtuber-revision.field-resolver';
import { YoutuberFieldResolver } from './fields-resolvers/youtuber.field-resolver';
import { YoutuberResolver } from './youtuber.resolver';
import { YoutuberService } from './youtuber.service';

@Module({
    imports: [
        ProposalModule,
        OpinionModule,
        TypeOrmModule.forFeature([
            YoutuberEntity,
            YoutuberRevisionEntity,
            YoutuberProposalEntity,
        ]),
    ],
    providers: [
        YoutuberResolver,
        YoutuberFieldResolver,
        YoutuberRevisionFieldResolver,
        YoutuberService,
    ],
})
export class YoutuberModule {}
