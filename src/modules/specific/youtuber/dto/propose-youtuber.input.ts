import { Field, ID, InputType } from '@nestjs/graphql';
import { mdMaxLength } from 'common/markdown-limit';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';
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

    @ConstraintDirective({
        maxLength: mdMaxLength,
    })
    content: string;

    @Field(() => [ID])
    categories: string[];

    @Field(() => [SocialMediaObject])
    socialMedia: SocialMediaObject[];
}
