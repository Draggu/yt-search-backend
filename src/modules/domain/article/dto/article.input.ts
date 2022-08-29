import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { mdMaxLength } from 'common/markdown-limit';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';
import { mentionDocsDescription } from 'modules/domain/markdown-mention/docs';

@InputType()
export class CreateArticleInput {
    @ConstraintDirective({
        maxLength: mdMaxLength,
    })
    @Field(() => String, {
        description: mentionDocsDescription,
    })
    content: string;

    @ConstraintDirective({
        maxLength: 80,
    })
    title: string;
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
    @Field(() => ID)
    id: string;
}
