import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { TokenEntity } from 'modules/specific/auth/entities/token.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => TokenEntity, (token) => token.owner)
    @HideField()
    authTokens: TokenEntity[];
}
