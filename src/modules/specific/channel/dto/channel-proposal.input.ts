import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class ChannelProposalInput {
    ytId: string;

    name: string;

    description: string;

    @Field(() => [ID])
    categories: string[];
}
