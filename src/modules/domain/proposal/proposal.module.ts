import { Module } from '@nestjs/common';
import { CategorieModule } from '../categorie/categorie.module';
import { MarkdownMentionModule } from '../markdown-mention/markdown-mention.module';
import { ProposalService } from './proposal.service';

@Module({
    imports: [MarkdownMentionModule, CategorieModule],
    providers: [ProposalService],
    exports: [ProposalService],
})
export class ProposalModule {}
