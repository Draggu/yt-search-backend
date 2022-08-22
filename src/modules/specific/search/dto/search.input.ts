import { Field, InputType } from '@nestjs/graphql';
import { SearchFieldsInput } from './search-fields.input';
import { SearchIncludeInput } from './search-include.input';

@InputType()
export class SearchInput {
    @Field(() => SearchIncludeInput)
    include: SearchIncludeInput;

    @Field(() => SearchFieldsInput)
    fields: SearchFieldsInput;

    /**
     * this is used as generic "search across"
     * use it if filters are not fitting
     */
    query?: string;
}
