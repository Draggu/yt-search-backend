import { Field, InputType, Int } from '@nestjs/graphql';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';

@InputType()
export class PageInput {
    @Field(() => Int, {
        defaultValue: 10,
    })
    @ConstraintDirective({
        exclusiveMin: 0,
        max: 20,
    })
    take: number = 10;

    @Field(() => Int, {
        defaultValue: 0,
    })
    @ConstraintDirective({
        min: 0,
    })
    skip: number = 0;
}
