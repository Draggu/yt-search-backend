import { Module } from '@nestjs/common';
import { OpinionResolver } from './opinion.resolver';
import { OpinionService } from './opinion.service';

@Module({
    providers: [OpinionResolver, OpinionService],
})
export class OpinionModule {}
