import { Test, TestingModule } from '@nestjs/testing';
import { LinkingsService } from '../linkings.service';

describe('LinkingsService', () => {
    let service: LinkingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LinkingsService],
        }).compile();

        service = module.get<LinkingsService>(LinkingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
