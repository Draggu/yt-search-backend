import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { ProposeYoutuberInput } from './dto/propose-youtuber.input';
import { YoutuberProposalEntity } from './entities/youtuber-proposal.entity';
import { YoutuberRevisionEntity } from './entities/youtuber-revision.entity';
import { YoutuberEntity } from './entities/youtuber.entity';

@Injectable()
export class YoutuberService {
    constructor(
        @InjectRepository(YoutuberEntity)
        private readonly youtuberRepository: Repository<YoutuberEntity>,
        @InjectRepository(YoutuberProposalEntity)
        private readonly youtuberProposalRepository: Repository<YoutuberProposalEntity>,
        @InjectRepository(YoutuberRevisionEntity)
        private readonly youtuberRevisionRepository: Repository<YoutuberRevisionEntity>,
    ) {}

    findOne(id: string) {
        return this.youtuberRepository.findOne({ where: { id } });
    }

    findProposals({ skip, take }: PageInput, id?: string) {
        return this.youtuberProposalRepository.find({
            skip,
            take,
            where: { id, isRejected: false },
        });
    }

    rejectProposal(id: string): Promise<YoutuberProposalEntity | undefined> {
        return this.youtuberProposalRepository
            .createQueryBuilder()
            .update({ isRejected: true })
            .where({
                id,
            })
            .returning('*')
            .execute()
            .then(({ raw }) => raw[0]);
    }

    async acceptProposal(
        currentUser: CurrentUser,
        id: string,
        edit?: ProposeYoutuberInput,
    ) {
        const {
            id: proposalId,
            isRejected: _,
            ...revisionData
        } = await this.youtuberProposalRepository.findOneOrFail({
            where: { id },
            relations: {
                editedBy: true,
                categories: true,
            },
        });

        const revision = edit
            ? {
                  ...edit,
                  categories: edit.categories.map((id) => ({ id })),
                  originalEdit: {
                      ...revisionData,
                      acceptedBy: currentUser,
                  },
                  acceptedBy: currentUser,
              }
            : {
                  ...revisionData,
                  acceptedBy: currentUser,
                  originalEdit: null,
              };

        const youtuber = await this.youtuberRepository.save({
            id,
        });

        await this.youtuberRevisionRepository.save({
            ...revision,
            youtuber,
        });

        return youtuber;
    }

    propose(
        currentUser: CurrentUser,
        { categories, ...propose }: ProposeYoutuberInput,
    ) {
        return this.youtuberProposalRepository.save({
            ...propose,
            editedBy: currentUser,
            categories: categories.map((id) => ({ id })),
        });
    }
}
