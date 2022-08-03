import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRequest } from 'helpers/get-request';

export const RecaptchaV3Guard = (action: string) =>
    mixin(
        class RecaptchaV3Guard implements CanActivate {
            constructor(readonly config: ConfigService) {}

            async canActivate(context: ExecutionContext): Promise<boolean> {
                const token = getRequest(context).header('recaptcha');

                const key = this.config.get('RECAPTCHA_KEY');

                const googleRes: { success: boolean; action: string } =
                    await fetch(
                        `https://www.google.com/recaptcha/api/siteverify?response=${token}&secret=${key}`,
                    ).then((res) => res.json());

                return googleRes.success && googleRes.action === action;
            }
        },
    );
