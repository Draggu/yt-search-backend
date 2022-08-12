import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
    content: string;
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
    @Field(() => ID)
    id: string;
    isHiden?: boolean;
}
