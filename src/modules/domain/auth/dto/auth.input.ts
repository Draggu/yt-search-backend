import { InputType } from '@nestjs/graphql';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';

@InputType()
export class LoginInput {
    @ConstraintDirective({
        minLength: 8,
    })
    password: string;

    @ConstraintDirective({ format: 'email' })
    email: string;

    deviceName: string;
}

@InputType()
export class RegisterInput extends LoginInput {
    @ConstraintDirective({
        minLength: 3,
    })
    name: string;
}
