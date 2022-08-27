import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateHideInput {
    reason?: string;
}
