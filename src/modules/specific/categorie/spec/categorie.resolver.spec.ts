import { Test, TestingModule } from '@nestjs/testing';
import { CategorieResolver } from './categorie.resolver';
import { CategorieService } from './categorie.service';

describe('CategorieResolver', () => {
    let resolver: CategorieResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategorieResolver, CategorieService],
        }).compile();

        resolver = module.get<CategorieResolver>(CategorieResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
