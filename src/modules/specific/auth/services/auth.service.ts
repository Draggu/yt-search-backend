import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as assert from 'assert';
import { compare, hash } from 'bcrypt';
import { CurrentUser } from 'directives/auth/types';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginInput, RegisterInput } from '../dto/auth.input';
import { UpdatePermissionInput } from '../dto/permissions.input';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly tokenService: TokenService,
    ) {}

    async register({ password, deviceName, ...registerInput }: RegisterInput) {
        const hashedPassword = await hash(password, 10);

        return this.userRepository.manager.transaction(async (manager) => {
            const user = await manager.save(UserEntity, {
                password: hashedPassword,
                ...registerInput,
            });

            const token = await this.tokenService.createFor(
                user,
                deviceName,
                manager,
            );

            return { user, token };
        });
    }

    async login({ password, deviceName, ...loginInput }: LoginInput) {
        const user = await this.userRepository.findOneOrFail({
            where: loginInput,
        });

        assert(compare(password, user.password));

        const token = await this.tokenService.createFor(user, deviceName);

        return { user, token };
    }

    logout(currentUser: CurrentUser, token: string, isName = true) {
        return this.tokenService.destroy(currentUser, token, isName);
    }

    async changePermissions(
        currentUser: CurrentUser,
        { userId, add, remove }: UpdatePermissionInput,
    ) {
        assert(
            currentUser.id !== userId,
            'user can not modify own permissions',
        );

        const user = await this.userRepository.findOneOrFail({
            where: {
                id: userId,
            },
        });

        const permissions = new Set([...user.permissions, ...add]);

        remove.forEach(permissions.delete, permissions);

        user.permissions = [...permissions];

        return this.userRepository.save(user);
    }

    resetPassword() {
        //TODO
    }
}
