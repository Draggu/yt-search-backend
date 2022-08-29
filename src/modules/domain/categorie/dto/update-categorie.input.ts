import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategorieInput {
    @Field(() => ID)
    categorieId: string;

    name: string;
}
