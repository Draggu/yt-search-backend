import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/auth.decorator';
import { Token } from 'directives/auth/decorators/token.decorator';
import { CurrentUser } from 'directives/auth/types';
import { RecaptchaV3 } from 'directives/recaptcha-v3/recaptcha-v3.decorator';
import { LoginInput, RegisterInput } from './dto/auth.input';
import { AuthPayload } from './entities/auth.entity';
import { TokenEntity } from './entities/token.entity';
import { AuthService } from './services/auth.service';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
    @RecaptchaV3('register')
    register(
        @Args('register') registerInput: RegisterInput,
    ): Promise<AuthPayload> {
        return this.authService.register(registerInput);
    }

    @Mutation(() => AuthPayload)
    @RecaptchaV3('login')
    login(@Args('login') loginInput: LoginInput): Promise<AuthPayload> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => TokenEntity)
    @RecaptchaV3('logout')
    logout(
        @Auth() currentUser: CurrentUser,
        @Token() token: string,
    ): Promise<TokenEntity> {
        return this.authService.logout(currentUser, token, false);
    }

    @Mutation(() => TokenEntity)
    @RecaptchaV3('logout-device')
    destroyToken(
        @Auth({
            confirmationRequired: true,
        })
        currentUser: CurrentUser,
        @Args('logout') tokenName: string,
    ): Promise<TokenEntity> {
        return this.authService.logout(currentUser, tokenName);
    }
}
