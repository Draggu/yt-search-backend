import { Args, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { SearchInput } from './dto/search.input';
import { SearchResult } from './entities/search-result.entity';
import { SearchService } from './services/search.service';

@Resolver()
export class SearchResolver {
    constructor(private readonly searchService: SearchService) {}

    @Query(() => [SearchResult])
    search(
        @Args('search') search: SearchInput,
        @Args('page') page: PageInput,
    ): Promise<SearchResult[]> {
        return this.searchService.search(search, page);
    }
}
