import { FieldMiddleware } from '@nestjs/graphql';
import { SocialMedia, SocialMediaObject } from '../dto/social-media.input';

export const socialMediaSerializeMiddleware: FieldMiddleware = async (
    ctx,
    next,
): Promise<SocialMediaObject[]> =>
    Object.entries(await next()).map(
        ([kind, value]: [SocialMedia, string]) => ({ kind, value }),
    );
