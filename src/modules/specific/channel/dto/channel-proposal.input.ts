import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ChannelProposalInput {
    @Field(() => ID)
    ytId: string;

    description: string;

    @Field(() => [ID])
    categories: string[];
}
