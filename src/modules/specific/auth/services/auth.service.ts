import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as assert from 'assert';
import { compare, hash } from 'bcrypt';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginInput, RegisterInput } from '../dto/auth.input';
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

        const user = await this.userRepository.create({
            password: hashedPassword,
            ...registerInput,
        });

        const token = await this.tokenService.createFor(user, deviceName);

        return { user, token };
    }

    async login({ password, deviceName, ...loginInput }: LoginInput) {
        const user = await this.userRepository.findOneOrFail({
            where: loginInput,
        });

        assert(compare(password, user.password));

        const token = await this.tokenService.createFor(user, deviceName);

        return { user, token };
    }

    resetPassword() {
        //TODO
    }
}
