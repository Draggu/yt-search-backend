import { Module } from '@nestjs/common';
import { MarkdownMentionService } from './markdown-mention.service';

@Module({
    providers: [MarkdownMentionService],
    exports: [MarkdownMentionService],
})
export class MarkdownModule {}
