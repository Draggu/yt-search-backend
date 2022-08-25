import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpinionTargetEntity } from './entities/opinion-target.entity';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionService } from './opinion.service';

@Module({
    imports: [TypeOrmModule.forFeature([OpinionEntity, OpinionTargetEntity])],
    providers: [OpinionService],
    exports: [OpinionService],
})
export class OpinionModule {}
