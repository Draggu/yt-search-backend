import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import * as assert from 'assert';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import {
    CategorieCreationMode,
    CreateCategorieInput,
} from './dto/create-categorie.input';
import { UpdateCategorieInput } from './dto/update-categorie.input';
import { CategorieEntity } from './entities/categorie.entity';

@Injectable()
export class CategorieService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(CategorieEntity)
        private readonly categorieRepository: Repository<CategorieEntity>,
    ) {}

    async assertAreLeafsAndMap(ids: string[]) {
        const leafsCategories = await this.categorieRepository.count({
            where: {
                id: In(ids),
                parent: IsNull(),
            },
        });

        assert(
            leafsCategories === new Set(ids).size,
            'categorie is not leaf categorie!',
        );

        return ids.map((id) => ({ id }));
    }

    async create({ mode, name, categorieId }: CreateCategorieInput) {
        const target = await this.categorieRepository.findOneOrFail({
            where: {
                id: categorieId,
            },
        });

        return this.categorieRepository.save(
            mode === CategorieCreationMode.DESCENDANT
                ? {
                      name,
                      parent: target,
                  }
                : {
                      name,
                      parent: target.parent,
                      children: [target],
                  },
        );
    }

    async subCategories(id?: string | null) {
        const categorie = await (id
            ? this.categorieRepository.findOneOrFail({
                  where: { id },
              })
            : this.entityManager
                  .getTreeRepository(CategorieEntity)
                  .findRoots()
                  .then(([root]) => root));

        return this.entityManager
            .getTreeRepository(CategorieEntity)
            .findDescendants(categorie);
    }

    rename({ name, categorieId }: UpdateCategorieInput) {
        return this.categorieRepository
            .createQueryBuilder()
            .update()
            .where('id = :id', { id: categorieId })
            .set({
                name,
            })
            .returning('*')
            .execute()
            .then(({ raw }) => raw[0]);
    }

    remove(id: string) {
        return this.categorieRepository.remove(
            this.categorieRepository.create({ id }),
        );
    }
}
