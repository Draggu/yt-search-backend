import { Test, TestingModule } from '@nestjs/testing';
import { OpinionResolver } from './opinion.resolver';
import { OpinionService } from './opinion.service';

describe('OpinionResolver', () => {
    let resolver: OpinionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OpinionResolver, OpinionService],
        }).compile();

        resolver = module.get<OpinionResolver>(OpinionResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
