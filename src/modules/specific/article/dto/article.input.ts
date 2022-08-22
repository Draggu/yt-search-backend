import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { mdMaxLength } from 'common/markdown-limit';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';

@InputType()
export class CreateArticleInput {
    @ConstraintDirective({
        maxLength: mdMaxLength,
    })
    content: string;
    title: string;
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
    @Field(() => ID)
    id: string;
}
