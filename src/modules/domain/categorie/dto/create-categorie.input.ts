import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';

export enum CategorieCreationMode {
    DESCENDANT = 'DESCENDANT',
    ANCESTOR = 'ANCESTOR',
}

registerEnumType(CategorieCreationMode, {
    name: 'CategorieCreationMode',
    description: `
        example state before creation

        root
        ├ one
        | ├ two
        | └ three
        ├ four
        └ five

        using
          name: six
          id: (here use id coresponding to one)

        if creation mode is set to DESCENDANT this will add new categorie under specified id
        the result will be:

        root
        ├ one
        | ├ six
        | ├ two
        | └ three
        ├ four
        └ five

        if creation mode is set to ANCESTOR this will add new categorie over specified id
        the result will be:

        root
        ├ six
        | └ one
        |   ├ two
        |   └ three
        ├ four
        └ five
    `,
});

@InputType()
export class CreateCategorieInput {
    @Field(() => ID)
    categorieId: string;

    name: string;

    mode: CategorieCreationMode;
}
