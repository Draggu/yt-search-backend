import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { TokenEntity } from './entities/token.entity';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([TokenEntity])],
    providers: [AuthResolver, AuthService, TokenService],
    exports: [AuthService],
})
export class AuthModule {}
