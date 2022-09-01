import { Field, ID, InputType } from '@nestjs/graphql';
import { mdMaxLength } from 'common/markdown-limit';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';
import { mentionDocsDescription } from 'modules/domain/markdown-mention/docs';
import { SocialMediaObject } from 'modules/domain/social-media/dto/social-media.input';

@InputType()
export class ProposeChannelInput {
    @Field(() => ID)
    ytId: string;

    @ConstraintDirective({
        maxLength: mdMaxLength,
    })
    @Field(() => String, {
        description: mentionDocsDescription,
    })
    content: string;

    @Field(() => [ID])
    categories: string[];

    @Field(() => [ID])
    youtubers: string[];

    @Field(() => [SocialMediaObject])
    socialMedia: SocialMediaObject[];
}
