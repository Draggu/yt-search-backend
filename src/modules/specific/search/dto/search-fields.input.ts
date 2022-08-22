import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';

export enum SearchFieldComparison {
    HIGHER = 'HIGHER',
    LOWER = 'LOWER',
}

registerEnumType(SearchFieldComparison, { name: 'SearchFieldComparison' });

@InputType()
export class SearchFieldDateInput {
    @Field(() => SearchFieldComparison)
    comparison: SearchFieldComparison;

    value: Date;
}

@InputType()
export class SearchFieldNumberInput {
    @Field(() => SearchFieldComparison)
    comparison: SearchFieldComparison;

    value: number;
}

@InputType()
export class SearchFieldsInput {
    createdAt?: SearchFieldDateInput;
    editedAt?: SearchFieldDateInput;
    lastSyncWithYT?: SearchFieldDateInput;
    birthday?: SearchFieldDateInput;
    opinions?: SearchFieldNumberInput;

    name?: string;
    realName?: string;
    content?: string;

    @Field(() => [ID], { nullable: true })
    author?: string[];
    @Field(() => [ID], { nullable: true })
    ytId?: string[];
    categorieNames?: string[];
}
