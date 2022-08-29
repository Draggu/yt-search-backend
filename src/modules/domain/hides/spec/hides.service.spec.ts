import { Test, TestingModule } from '@nestjs/testing';
import { HidesService } from '../hides.service';

describe('HidesService', () => {
    let service: HidesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HidesService],
        }).compile();

        service = module.get<HidesService>(HidesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
