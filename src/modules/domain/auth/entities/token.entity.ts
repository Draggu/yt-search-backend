import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
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
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => UserEntity, (user) => user.authTokens, {
        nullable: false,
        cascade: true,
    })
    @JoinColumn()
    owner: UserEntity;
}
