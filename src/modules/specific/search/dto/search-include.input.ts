import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchIncludeInput {
    @Field(() => Boolean, {
        defaultValue: true,
    })
    articles: boolean;

    @Field(() => Boolean, {
        defaultValue: true,
    })
    channels: boolean;

    @Field(() => Boolean, {
        defaultValue: true,
    })
    youtubers: boolean;
}
