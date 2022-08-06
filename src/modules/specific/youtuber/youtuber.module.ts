import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionModule } from 'modules/generic/opinion/opinion.module';
import { YoutuberOpinionEntity } from './entities/youtuber-opinion.entity';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberOpinionFieldResolver } from './fields-resolvers/youtuber-opinion-youtuber-fields.resolver';
import { YoutuberResolver } from './youtuber.resolver';
import { YoutuberService } from './youtuber.service';

@Module({
    imports: [
        OpinionModule.forFeature(YoutuberOpinionEntity, 'id', {
            methodName: 'commentYoutuber',
            tragetIdName: 'youtuberId',
        }),
        //TODO add revision
        TypeOrmModule.forFeature([YoutuberEntity]),
    ],
    providers: [
        YoutuberResolver,
        YoutuberOpinionFieldResolver,
        YoutuberService,
    ],
})
export class YoutuberModule {}
