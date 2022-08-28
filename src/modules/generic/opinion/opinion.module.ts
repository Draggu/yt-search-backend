import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HidesModule } from '../hides/hides.module';
import { OpinionTargetEntity } from './entities/opinion-target.entity';
import { OpinionEntity } from './entities/opinion.entity';
import { OpinionResolver } from './opinion.resolver';
import { OpinionService } from './opinion.service';

@Module({
    imports: [
        HidesModule,
        TypeOrmModule.forFeature([OpinionEntity, OpinionTargetEntity]),
    ],
    providers: [OpinionResolver, OpinionService],
    exports: [OpinionService],
})
export class OpinionModule {}
