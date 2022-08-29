import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { RegisterInput } from 'modules/domain/auth/dto/auth.input';

@InputType()
export class UpdateUserInput extends PartialType(
    OmitType(RegisterInput, ['deviceName', 'password']),
) {}
