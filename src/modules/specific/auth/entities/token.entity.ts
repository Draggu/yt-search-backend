import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
@Unique('avoid_same_token_conflict', ['id', 'name', 'owner'])
@ObjectType()
export class TokenEntity {
    @Field({ name: 'token' })
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => UserEntity, (user) => user.authTokens, {
        nullable: false,
    })
    @JoinColumn()
    owner: UserEntity;
}
