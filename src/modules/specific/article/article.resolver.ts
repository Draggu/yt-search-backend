import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { RemoveNullsPipe } from 'pipes/remove-nulls.pipe';
import { ArticleService } from './article.service';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleEntity } from './entities/article.entity';

@Resolver(() => ArticleEntity)
export class ArticleResolver {
    constructor(private readonly articleService: ArticleService) {}

    @Mutation(() => ArticleEntity)
    writeArticle(
        @Auth({
            permissions: [Permissions.WRITE_ARTICLE],
        })
        currentUser: CurrentUser,
        @Args('createArticleInput') createArticleInput: CreateArticleInput,
    ): Promise<ArticleEntity> {
        return this.articleService.create(currentUser, createArticleInput);
    }

    @Query(() => ArticleEntity, {
        nullable: true,
        description: `if authed user permissions include ${Permissions.EDIT_ARTICLE} hiden articles will be shown`,
    })
    article(
        @Args('id', { type: () => ID }) id: string,
        @Auth({
            optional: true,
        })
        currentUser?: CurrentUser,
    ): Promise<ArticleEntity | null> {
        return this.articleService.findOne(id, currentUser);
    }

    @Mutation(() => ArticleEntity)
    updateArticle(
        @Auth({
            permissions: [Permissions.EDIT_ARTICLE],
        })
        currentUser: CurrentUser,
        @Args('updateArticleInput', RemoveNullsPipe)
        updateArticleInput: UpdateArticleInput,
    ): Promise<ArticleEntity> {
        return this.articleService.update(currentUser, updateArticleInput);
    }

    @Mutation(() => ArticleEntity)
    changeArticleVisibility(
        @Auth({
            permissions: [Permissions.EDIT_ARTICLE],
        })
        currentUser: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
    ): Promise<ArticleEntity> {
        return this.articleService.changeVisibility(currentUser, id);
    }
}
