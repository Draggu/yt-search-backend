import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Permissions } from 'directives/auth/types';
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
    @HideField()
    password: string;

    @ManyToOne(() => TokenEntity, (token) => token.owner)
    @HideField()
    authTokens: TokenEntity[];

    @Column({
        type: 'enum',
        enum: Permissions,
        array: true,
        default: [Permissions.COMMENT, Permissions.PROPOSE],
    })
    @Field(() => [Permissions], {
        description: 'by default every user receives [COMMENT, PROPOSE]',
    })
    permissions: Permissions[];
}
