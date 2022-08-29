import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { CreateHideInput } from '../hides/dto/create-hide.input';
import { HidesService } from '../hides/hides.service';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';

@Injectable()
export class OpinionService {
    constructor(
        @InjectRepository(OpinionEntity)
        private readonly opinionRepository: Repository<OpinionEntity>,
        private readonly hidesService: HidesService,
    ) {}

    createTarget() {
        return this.opinionRepository.create();
    }

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
            hideTarget: this.hidesService.createTarget(),
        });
    }

    async toogleHide(
        currentUser: CurrentUser,
        id: string,
        createHideInput: CreateHideInput,
    ) {
        const opinion = await this.opinionRepository.findOneOrFail({
            where: { id },
        });

        return this.hidesService.toogleHide(
            currentUser,
            opinion.hideTarget.id,
            createHideInput,
        );
    }
}
