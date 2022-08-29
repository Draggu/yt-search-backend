import {
    Field,
    InputType,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql';

export enum SocialMedia {
    FACEBOOK = 'FACEBOOK',
    INSTAGRAM = 'INSTAGRAM',
    TWITTER = 'TWITTER',
    SNAPCHAT = 'SNAPCHAT',
    TIKTOK = 'TIKTOK',
}

registerEnumType(SocialMedia, {
    name: 'SocialMedia',
});

@ObjectType('SocialMediaEntity')
@InputType('SocialMediaInput')
export class SocialMediaObject {
    @Field(() => SocialMedia)
    kind: SocialMedia;

    value: string;
}
