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
        currentUser: CurrentUser,
        { target, ...createOpinionInput }: CreateOpinionInput,
    ) {
        //TODO target matching
        return this.opinionRepository.insert({
            ...createOpinionInput,
            author: currentUser,
        });
    }
}
