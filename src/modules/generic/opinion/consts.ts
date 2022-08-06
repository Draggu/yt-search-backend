import { Type } from '@nestjs/common';
import { OpinionEntity } from './entities/opinion.entity';

export const OpinionTargetKey = 'OpinionTargetKey';

export type Opinion = {
    target: object;
} & OpinionEntity;

export interface OpinionConfig<T extends Opinion = Opinion> {
    target: Type<T>;
    idKey: keyof T;
}
