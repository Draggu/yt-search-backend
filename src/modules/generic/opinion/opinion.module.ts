import { DynamicModule, Module, Type } from '@nestjs/common';
import { OpinionTargetKey } from './consts';
import { OpinionEntity } from './entities/opinion.entity';
import {
    createOpinionResolver,
    OpinionResolverOptions,
} from './opinion.resolver';
import { OpinionService } from './opinion.service';

export type Opinion = {
    target: object;
} & OpinionEntity;

export interface OpinionConfig<T extends Opinion = Opinion> {
    target: Type<T>;
    idKey: keyof T;
}

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
                createOpinionResolver(resolverOptions),
                {
                    provide: OpinionTargetKey,
                    useValue: config,
                },
                OpinionService,
            ],
        };
    }
}
