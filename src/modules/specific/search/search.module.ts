import { Module } from '@nestjs/common';
import { SearchResolver } from './search.resolver';
import { SearchQueryService } from './services/query.service';
import { SearchService } from './services/search.service';

@Module({
    providers: [SearchResolver, SearchService, SearchQueryService],
})
export class SearchModule {}
