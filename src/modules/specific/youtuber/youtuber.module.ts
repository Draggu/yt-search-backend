import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { YoutuberOpinionEntity } from './entities/youtuber-opinion.entity';
import { YoutuberProposalEntity } from './entities/youtuber-proposal.entity';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberOpinionFieldResolver } from './fields-resolvers/youtuber-opinion.field-resolver';
import { YoutuberRevisionFieldResolver } from './fields-resolvers/youtuber-revision.field-resolver';
import { YoutuberFieldResolver } from './fields-resolvers/youtuber.field-resolver';
import { YoutuberResolver } from './youtuber.resolver';
import { YoutuberService } from './youtuber.service';

@Module({
    imports: [
        OpinionModule.forFeature(YoutuberOpinionEntity, 'id', {
            methodName: 'commentYoutuber',
            targetIdName: 'youtuberId',
        }),
        TypeOrmModule.forFeature([
            YoutuberEntity,
            YoutuberRevisionEntity,
            YoutuberProposalEntity,
            YoutuberOpinionEntity,
        ]),
    ],
    providers: [
        YoutuberResolver,
        YoutuberFieldResolver,
        YoutuberOpinionFieldResolver,
        YoutuberRevisionFieldResolver,
        YoutuberService,
    ],
})
export class YoutuberModule {}
