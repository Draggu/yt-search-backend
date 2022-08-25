import { HideField } from '@nestjs/graphql';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OpinionEntity } from './opinion.entity';

@Entity()
export class OpinionTargetEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => OpinionEntity, (opinion) => opinion.target)
    @HideField()
    opinions: OpinionEntity[];
}
