import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YoutuberEntity } from './entities/youtuber.entity';
import { YoutuberResolver } from './youtuber.resolver';
import { YoutuberService } from './youtuber.service';

@Module({
    imports: [TypeOrmModule.forFeature([YoutuberEntity])], //TODO add revision
    providers: [YoutuberResolver, YoutuberService],
})
export class YoutuberModule {}
