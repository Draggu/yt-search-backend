import { DynamicModule, Module, Type } from '@nestjs/common';
import { Opinion, OpinionTargetKey } from './consts';
import { OpinionService } from './opinion.service';

@Module({
    providers: [OpinionService],
    exports: [OpinionService],
})
export class OpinionModule {
    static forFeature(target: Type<Opinion>): DynamicModule {
        return {
            module: OpinionModule,
            providers: [
                {
                    provide: OpinionTargetKey,
                    useValue: target,
                },
            ],
        };
    }
}
