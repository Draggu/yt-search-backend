import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
    ) {}

    getUser(token: string) {
        return this.tokenRepository
            .findOneOrFail({
                where: {
                    id: token,
                },
                relations: {
                    owner: {},
                },
                select: {},
            })
            .then(({ owner: { id, password } }) => ({ id, password }));
    }

    createFor(
        user: UserEntity,
        tokenName: string,
        entityManager?: EntityManager,
    ) {
        const manager = entityManager || this.tokenRepository.manager;

        return manager.save(TokenEntity, {
            name: tokenName,
            owner: user,
        });
    }

    destroy(currentUser: CurrentUser, token: string, isName: boolean) {
        return this.tokenRepository.remove(
            this.tokenRepository.create({
                ...(isName ? { name: token } : { id: token }),
                owner: currentUser,
            }),
        );
    }
}
