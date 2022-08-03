import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ProposeYoutuberInput {
    name: string;

    realName?: string;

    birthday?: Date;

    description: string;

    @Field(() => [ID])
    categories: string[];
}
