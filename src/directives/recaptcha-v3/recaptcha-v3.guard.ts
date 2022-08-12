import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRequest } from 'helpers/get-request';
import fetch from 'node-fetch';

export const RecaptchaV3Guard = (action: string) => {
    @Injectable()
    class RecaptchaV3Guard implements CanActivate {
        constructor(private readonly config: ConfigService) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const token = getRequest(context).header('recaptcha');

            const key = this.config.get('RECAPTCHA_KEY');

            const googleRes: { success: boolean; action: string } = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?response=${token}&secret=${key}`,
            ).then((res) => res.json());

            return googleRes.success && googleRes.action === action;
        }
    }

    return RecaptchaV3Guard;
};
