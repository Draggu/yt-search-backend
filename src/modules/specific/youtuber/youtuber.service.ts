import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { socialMedia2Map } from 'modules/generic/social-media/helpers/to-map';
import { EntityManager, Repository } from 'typeorm';
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
        @InjectEntityManager() private readonly entityManager: EntityManager,
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
        const proposal = await this.youtuberProposalRepository.findOneOrFail({
            where: { id },
            relations: {
                editedBy: true,
                categories: true,
            },
        });

        const { youtuberId, id: _, isRejected: __, ...revisionData } = proposal;

        const revision = edit
            ? {
                  ...edit,
                  socialMedia: socialMedia2Map(edit.socialMedia),
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

        return this.entityManager.transaction(async (manager) => {
            const orCreate = (youtuber: YoutuberEntity | null) =>
                youtuber ||
                manager.save(YoutuberEntity, this.youtuberRepository.create());

            const youtuber = youtuberId
                ? await manager
                      .findOne(YoutuberEntity, {
                          where: {
                              id: youtuberId,
                          },
                      })
                      .then(orCreate)
                : await orCreate(null);

            await manager.remove(YoutuberProposalEntity, proposal);

            youtuber.lastRevision = await manager.save(YoutuberRevisionEntity, {
                ...revision,
                youtuber,
            });

            return manager.save(YoutuberEntity, youtuber);
        });
    }

    propose(
        currentUser: CurrentUser,
        { categories, socialMedia, ...propose }: ProposeYoutuberInput,
    ) {
        return this.youtuberProposalRepository.save({
            ...propose,
            editedBy: currentUser,
            categories: categories.map((id) => ({ id })),
            socialMedia: socialMedia2Map(socialMedia),
        });
    }
}
