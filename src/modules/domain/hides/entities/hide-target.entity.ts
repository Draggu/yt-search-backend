import { HideField } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HideEntity } from './hide.entity';

@Entity()
export class HideTargetEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => HideEntity, (hide) => hide.target)
    @HideField()
    hides: HideEntity[];

    @Column({
        default: false,
    })
    isHiden: boolean;
}
