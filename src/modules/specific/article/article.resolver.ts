import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { CreateHideInput } from 'modules/generic/hides/dto/create-hide.input';
import { HideEntity } from 'modules/generic/hides/entities/hide.entity';
import { CreateOpinionInput } from 'modules/generic/opinion/dto/create-opinion.input';
import { OpinionEntity } from 'modules/generic/opinion/entities/opinion.entity';
import { RemoveNullsPipe } from 'pipes/remove-nulls.pipe';
import { ArticleService } from './article.service';
import { seeHidenArticlesDescription } from './docs';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleEntity } from './entities/article.entity';

@Resolver(() => ArticleEntity)
export class ArticleResolver {
    constructor(private readonly articleService: ArticleService) {}

    @Mutation(() => OpinionEntity)
    commentArticle(
        @Args('articleId', { type: () => ID })
        articleId: string,
        @Args('opinion') createOpinionInput: CreateOpinionInput,
        @Auth({
            optional: true,
            permissions: [Permissions.COMMENT],
        })
        currentUser?: CurrentUser,
    ): Promise<OpinionEntity> {
        return this.articleService.comment(
            articleId,
            createOpinionInput,
            currentUser,
        );
    }

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
        description: seeHidenArticlesDescription,
    })
    article(
        @Args('id', { type: () => ID }) id: string,
        @Auth({
            optional: true,
        })
        currentUser?: CurrentUser,
    ): Promise<ArticleEntity | null | undefined> {
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

    @Mutation(() => HideEntity)
    toogleArticleHide(
        @Auth({
            permissions: [Permissions.TOGGLE_HIDE],
        })
        currentUser: CurrentUser,
        @Args('id', { type: () => ID }) id: string,
        @Args('createHideInput') createHideInput: CreateHideInput,
    ): Promise<HideEntity> {
        return this.articleService.toogleHide(currentUser, id, createHideInput);
    }
}
