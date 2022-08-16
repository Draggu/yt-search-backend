import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ProposeChannelInput {
    @Field(() => ID)
    ytId: string;

    description: string;

    @Field(() => [ID])
    categories: string[];
}
