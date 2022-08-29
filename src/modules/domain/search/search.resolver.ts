import { Args, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { seeHidenArticlesDescription } from '../article/docs';
import { SearchInput } from './dto/search.input';
import { SearchResult } from './entities/search-result.entity';
import { SearchService } from './services/search.service';

@Resolver()
export class SearchResolver {
    constructor(private readonly searchService: SearchService) {}

    @Query(() => [SearchResult], {
        description: seeHidenArticlesDescription,
    })
    search(
        @Args('search') search: SearchInput,
        @Args('page') page: PageInput,
        @Auth({
            optional: true,
        })
        currentUser?: CurrentUser,
    ): Promise<SearchResult[]> {
        return this.searchService.search(search, page, currentUser);
    }
}
