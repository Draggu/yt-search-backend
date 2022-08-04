import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ArticleService } from '../article.service';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';

@Resolver(() => ArticleRevisionEntity)
export class ArticleRevisionResolver {
    constructor(private readonly articleService: ArticleService) {}

    @ResolveField(() => ArticleRevisionEntity, { nullable: true })
    previous(
        @Parent() revision: ArticleRevisionEntity,
    ): Promise<ArticleRevisionEntity | null> {
        return this.articleService.previousRevision(revision);
    }
}
