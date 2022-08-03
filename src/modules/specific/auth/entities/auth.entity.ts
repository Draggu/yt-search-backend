import { ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { TokenEntity } from './token.entity';

@ObjectType()
export class AuthPayload {
    user: UserEntity;
    token: TokenEntity;
}
