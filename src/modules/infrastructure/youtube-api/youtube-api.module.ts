import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class Youtube extends youtube_v3.Youtube {}

@Module({
    providers: [
        {
            provide: Youtube,
            useFactory: (config: ConfigService) =>
                google.youtube({
                    version: 'v3',
                    auth: config.getOrThrow('GAPI_KEY'),
                }),
            inject: [ConfigService],
        },
    ],
    exports: [Youtube],
})
export class YoutubeAPI {}
