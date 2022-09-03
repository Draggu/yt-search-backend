import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkingProposalEntity } from './entities/linking-proposal.entity';
import { LinkingEntity } from './entities/linking.entity';
import { LinkingsResolver } from './linkings.resolver';
import { LinkingsService } from './linkings.service';

@Module({
    imports: [TypeOrmModule.forFeature([LinkingEntity, LinkingProposalEntity])],
    providers: [LinkingsResolver, LinkingsService],
})
export class LinkingsModule {}
