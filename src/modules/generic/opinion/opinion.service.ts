import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';

@Injectable()
export class OpinionService {
    constructor(
        @InjectRepository(OpinionEntity)
        private readonly opinionRepository: Repository<OpinionEntity>,
    ) {}

    create(
        createOpinionInput: CreateOpinionInput,
        opinionTargetId: string,
        currentUser?: CurrentUser,
    ) {
        return this.opinionRepository.save({
            ...createOpinionInput,
            author: currentUser,
            target: {
                id: opinionTargetId,
            },
        });
    }
}
