import { DynamicModule, Module, Type } from '@nestjs/common';
import { Opinion, OpinionConfig, OpinionTargetKey } from './consts';
import {
    createOpinionResolver,
    OpinionResolverOptions,
} from './opinion.resolver';
import { OpinionService } from './opinion.service';

@Module({})
export class OpinionModule {
    static forFeature<T extends Opinion>(
        target: Type<T>,
        idKey: keyof T,
        resolverOptions: OpinionResolverOptions,
    ): DynamicModule {
        const config: OpinionConfig<T> = {
            target,
            idKey,
        };

        return {
            module: OpinionModule,
            providers: [
                createOpinionResolver(target, resolverOptions),
                {
                    provide: OpinionTargetKey,
                    useValue: config,
                },
                OpinionService,
            ],
        };
    }
}
