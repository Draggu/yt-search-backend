import {
    Args,
    ID,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { CurrentUser } from 'directives/auth/types';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { ArticleService } from '../article.service';
import { CreateArticleInput, UpdateArticleInput } from '../dto/article.input';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';
import { ArticleEntity } from '../entities/article.entity';

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

    @ResolveField(() => ArticleRevisionEntity)
    content(@Parent() article: ArticleEntity): Promise<ArticleRevisionEntity> {
        return this.articleService.getContent(article);
    }

    @ResolveField(() => [UserEntity], {
        description:
            'this does not include original Author! There is no order guarantee!',
    })
    allEditors(@Parent() article: ArticleEntity): Promise<UserEntity[]> {
        return this.articleService.getAllEditors(article);
    }
}
