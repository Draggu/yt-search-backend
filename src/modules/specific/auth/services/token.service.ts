import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    getUser(token: string) {
        return this.userRepository.findOneOrFail({
            where: {
                authTokens: {
                    id: token,
                },
            },
        });
    }

    createFor(currentUser: CurrentUser, tokenName: string) {
        return this.tokenRepository.create({
            name: tokenName,
            owner: currentUser,
        });
    }

    destroy(currentUser: CurrentUser, tokenName: string) {
        return this.tokenRepository.delete({
            name: tokenName,
            owner: currentUser,
        });
    }
}
