import { SocialMediaObject } from '../dto/social-media.input';

export const socialMedia2Map = (socialMedia: SocialMediaObject[]) =>
    Object.fromEntries(socialMedia.map(({ kind, value }) => [kind, value]));
