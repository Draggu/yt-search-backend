import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkdownMentionModule } from 'modules/generic/markdown-mention/markdown-mention.module';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { CategorieModule } from '../categorie/categorie.module';
import { YoutuberProposalEntity } from './entities/youtuber-proposal.entity';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberRevisionFieldResolver } from './fields-resolvers/youtuber-revision.field-resolver';
import { YoutuberFieldResolver } from './fields-resolvers/youtuber.field-resolver';
import { YoutuberResolver } from './youtuber.resolver';
import { YoutuberService } from './youtuber.service';

@Module({
    imports: [
        CategorieModule,
        OpinionModule,
        TypeOrmModule.forFeature([
            YoutuberEntity,
            YoutuberRevisionEntity,
            YoutuberProposalEntity,
        ]),
        MarkdownMentionModule,
    ],
    providers: [
        YoutuberResolver,
        YoutuberFieldResolver,
        YoutuberRevisionFieldResolver,
        YoutuberService,
    ],
})
export class YoutuberModule {}
