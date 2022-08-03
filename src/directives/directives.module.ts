import { Module } from '@nestjs/common';
import { AuthDirective } from './auth/auth.directive';

const directives = [AuthDirective];

@Module({
    providers: directives,
    exports: directives,
})
export class DirectivesModule {}
