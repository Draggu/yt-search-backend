import { Test, TestingModule } from '@nestjs/testing';
import { HidesResolver } from './hides.resolver';
import { HidesService } from './hides.service';

describe('HidesResolver', () => {
    let resolver: HidesResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HidesResolver, HidesService],
        }).compile();

        resolver = module.get<HidesResolver>(HidesResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
