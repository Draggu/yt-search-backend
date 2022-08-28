import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { EntityManager, Repository } from 'typeorm';
import { CreateHideInput } from '../hides/dto/create-hide.input';
import { HideTargetEntity } from '../hides/entities/hide-target.entity';
import { HidesService } from '../hides/hides.service';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionEntity } from './entities/opinion.entity';

@Injectable()
export class OpinionService {
    constructor(
        @InjectRepository(OpinionEntity)
        private readonly opinionRepository: Repository<OpinionEntity>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly hidesService: HidesService,
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
            hideTarget: this.entityManager.create(HideTargetEntity),
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
