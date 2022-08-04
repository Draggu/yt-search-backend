import { Field, InputType, Int } from '@nestjs/graphql';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';

@InputType()
export class CreateOpinionInput {
    @Field(() => Int)
    @ConstraintDirective({
        max: 10,
        min: 1,
    })
    stars: number;

    @ConstraintDirective({
        max: 500,
    })
    content?: string;
}
