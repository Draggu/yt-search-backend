import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { ConstraintDirective } from 'directives/constraint/constraint-directive.decorator';

export enum Opinionable {
    Youtuber = 'Youtuber',
    Channel = 'Channel',
    Article = 'Article',
}

registerEnumType(Opinionable, {
    name: 'Opinionable',
});

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

    target: Opinionable;
}
