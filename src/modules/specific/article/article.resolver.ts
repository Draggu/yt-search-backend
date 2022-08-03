import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { ArticleService } from './article.service';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleEntity } from './entities/article.entity';

@Resolver(() => ArticleEntity)
export class ArticleResolver {
    constructor(private readonly articleService: ArticleService) {}

    @Mutation(() => ArticleEntity)
    writeArticle(
        @Auth() currentUser: CurrentUser,
        @Args('createArticleInput') createArticleInput: CreateArticleInput,
    ): Promise<ArticleEntity> {
        return this.articleService.create(currentUser, createArticleInput);
    }

    @Query(() => ArticleEntity, {
        nullable: true,
    })
    article(
        @Args('id', { type: () => ID }) id: string,
    ): Promise<ArticleEntity | null> {
        return this.articleService.findOne(id);
    }

    @Mutation(() => ArticleEntity)
    updateArticle(
        @Auth() currentUser: CurrentUser,
        @Args('updateArticleInput') updateArticleInput: UpdateArticleInput,
    ): Promise<ArticleEntity> {
        return this.articleService.update(currentUser, updateArticleInput);
    }
}
