import { Field, ID, InputType } from '@nestjs/graphql';
import { SocialMediaObject } from 'modules/generic/social-media/dto/social-media.input';

@InputType()
export class ProposeYoutuberInput {
    @Field(() => ID, {
        nullable: true,
    })
    youtuberId?: string;

    name: string;

    realName?: string;

    birthday?: Date;

    description: string;

    @Field(() => [ID])
    categories: string[];

    @Field(() => [SocialMediaObject])
    socialMedia: SocialMediaObject[];
}
