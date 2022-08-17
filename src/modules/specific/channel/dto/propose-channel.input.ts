import { Field, ID, InputType } from '@nestjs/graphql';
import { SocialMediaObject } from 'modules/generic/social-media/dto/social-media.input';

@InputType()
export class ProposeChannelInput {
    @Field(() => ID)
    ytId: string;

    description: string;

    @Field(() => [ID])
    categories: string[];

    @Field(() => [SocialMediaObject])
    socialMedia: SocialMediaObject[];
}
