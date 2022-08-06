import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
    content: string;
    //TODO add @mention of youtuber / channel / user
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
    @Field(() => ID)
    id: string;
    isHiden?: boolean;
}
