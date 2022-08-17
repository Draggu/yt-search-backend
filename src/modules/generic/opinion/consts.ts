import { OpinionEntity } from './entities/opinion.entity';

export const OpinionTargetKey = 'OpinionTargetKey';

export type Opinion = {
    target: object;
    id: string;
} & OpinionEntity;
