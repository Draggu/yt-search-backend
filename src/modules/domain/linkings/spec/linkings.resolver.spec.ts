import { Test, TestingModule } from '@nestjs/testing';
import { LinkingsResolver } from './linkings.resolver';
import { LinkingsService } from './linkings.service';

describe('LinkingsResolver', () => {
    let resolver: LinkingsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LinkingsResolver, LinkingsService],
        }).compile();

        resolver = module.get<LinkingsResolver>(LinkingsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
