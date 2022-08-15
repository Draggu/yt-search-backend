import { Field, ID, InputType } from '@nestjs/graphql';
import { Permissions } from 'directives/auth/types';

@InputType()
export class UpdatePermissionInput {
    @Field(() => ID) userId: string;

    @Field(() => [Permissions], {
        defaultValue: [],
    })
    add: Permissions[];

    @Field(() => [Permissions], {
        defaultValue: [],
    })
    remove: Permissions[];
}
