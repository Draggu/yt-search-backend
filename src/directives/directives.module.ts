import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/domain/auth/auth.module';
import { AuthDirective } from './auth/auth.directive';

const directives = [AuthDirective];

@Module({
    imports: [AuthModule],
    providers: directives,
    exports: directives,
})
export class DirectivesModule {}
