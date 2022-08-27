import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HideTargetEntity } from './entities/hide-target.entity';
import { HideEntity } from './entities/hide.entity';
import { HidesResolver } from './hides.resolver';
import { HidesService } from './hides.service';

@Module({
    imports: [TypeOrmModule.forFeature([HideTargetEntity, HideEntity])],
    providers: [HidesResolver, HidesService],
    exports: [HidesService],
})
export class HidesModule {}
