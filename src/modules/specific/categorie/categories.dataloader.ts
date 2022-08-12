import { Injectable, Type } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { EntityManager, In } from 'typeorm';
import { CategorieEntity } from './entities/categorie.entity';
export const CategoriesDataloader = <
    E extends Type<{
        id: string;
        categories: CategorieEntity[];
    }>,
>(
    Entity: E,
) => {
    @Injectable()
    class _CategoriesDataloader extends DataLoader<string, CategorieEntity[]> {
        constructor(@InjectEntityManager() entityManager: EntityManager) {
            super(async (ids) => {
                const categories = await entityManager
                    .getRepository(Entity)
                    .find({
                        where: {
                            id: In(ids.flat(1)),
                        },
                        relations: {
                            categories: true,
                        },
                        select: {
                            id: true,
                        },
                    });

                const categoriesMap = Object.fromEntries(
                    categories.map(({ id, categories }) => [id, categories]),
                );

                return ids.map((id) => categoriesMap[id]);
            });
        }
    }

    return _CategoriesDataloader;
};
