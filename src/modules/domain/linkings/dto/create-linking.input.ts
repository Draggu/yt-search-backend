import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLinkingInput {
    @Field(() => ID)
    youtuberId: string;

    @Field(() => ID)
    channelYtId: string;

    @Field(() => Boolean, {
        defaultValue: false,
    })
    isRemoving: boolean;
}
