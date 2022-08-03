import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategorieService } from './categorie.service';
import { CreateCategorieInput } from './dto/create-categorie.input';
import { UpdateCategorieInput } from './dto/update-categorie.input';
import { CategorieEntity } from './entities/categorie.entity';

@Resolver(() => CategorieEntity)
export class CategorieResolver {
    constructor(private readonly categorieService: CategorieService) {}

    @Mutation(() => CategorieEntity)
    createCategorie(
        @Args('createCategorieInput')
        createCategorieInput: CreateCategorieInput,
    ): Promise<CategorieEntity> {
        return this.categorieService.create(createCategorieInput);
    }

    @Query(() => [CategorieEntity], {
        description: `
        categories are returned in flat normalized array
        id defaults to ROOT categorie
        `,
    })
    subCategories(
        @Args('id', { type: () => ID, nullable: true }) id?: string | null,
    ): Promise<CategorieEntity[]> {
        return this.categorieService.subCategories(id);
    }

    @Mutation(() => CategorieEntity)
    renameCategorie(
        @Args('updateCategorieInput')
        updateCategorieInput: UpdateCategorieInput,
    ): Promise<CategorieEntity> {
        return this.categorieService.rename(updateCategorieInput);
    }

    @Mutation(() => CategorieEntity)
    removeCategorie(
        @Args('id', { type: () => ID }) id: string,
    ): Promise<CategorieEntity> {
        return this.categorieService.remove(id);
    }
}
