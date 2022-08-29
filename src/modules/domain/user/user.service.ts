import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    findOne(id: string) {
        return this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    update(currentUser: CurrentUser, updateUserInput: UpdateUserInput) {
        return this.userRepository.save({
            id: currentUser.id,
            ...updateUserInput,
        });
    }
}
