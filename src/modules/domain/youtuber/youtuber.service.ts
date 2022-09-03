import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { CreateOpinionInput } from 'modules/domain/opinion/dto/create-opinion.input';
import { OpinionService } from 'modules/domain/opinion/opinion.service';
import { Repository } from 'typeorm';
import { ProposalService } from '../proposal/proposal.service';
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
        private readonly opinionService: OpinionService,
        private readonly proposalService: ProposalService,
    ) {}

    async comment(
        youtuberId: string,
        createOpinionInput: CreateOpinionInput,
        currentUser?: CurrentUser,
    ) {
        return this.opinionService.create(
            createOpinionInput,
            await this.youtuberRepository
                .findOneOrFail({ where: { id: youtuberId } })
                .then((youtuber) => youtuber.opinionTarget.id),
            currentUser,
        );
    }

    findOne(id: string) {
        return this.youtuberRepository.findOne({ where: { id } });
    }

    findProposals(page: PageInput, id?: string) {
        return this.proposalService.findProposals(
            YoutuberProposalEntity,
            page,
            { id },
        );
    }

    rejectProposal(id: string) {
        return this.proposalService.rejectProposal(YoutuberProposalEntity, id);
    }

    async acceptProposal(
        currentUser: CurrentUser,
        id: string,
        edit?: ProposeYoutuberInput,
    ) {
        return this.youtuberProposalRepository.manager.transaction(
            async (manager) => {
                const proposal = await manager
                    .createQueryBuilder(YoutuberProposalEntity, 'p')
                    .loadAllRelationIds({
                        disableMixedMap: true,
                    })
                    .where({ id })
                    .setLock('pessimistic_write', undefined, [
                        manager.connection.getMetadata(YoutuberProposalEntity)
                            .tableName,
                    ])
                    .getOneOrFail();

                const {
                    youtuber: _youtuber,
                    id: _,
                    isRejected: __,
                    ...revisionData
                } = proposal;

                const youtuber =
                    _youtuber ||
                    (await manager.save(
                        YoutuberEntity,
                        this.youtuberRepository.create({
                            opinionTarget: this.opinionService.createTarget(),
                        }),
                    ));

                await manager.remove(YoutuberProposalEntity, proposal);

                const revision = await manager.save(YoutuberRevisionEntity, {
                    ...revisionData,
                    originOf: edit
                        ? {
                              ...edit,
                              ...(await this.proposalService.commonMaps(
                                  edit.content,
                                  edit.socialMedia,
                                  edit.categories,
                              )),
                              acceptedBy: currentUser,
                              youtuber,
                          }
                        : undefined,
                    acceptedBy: currentUser,
                    youtuber,
                });

                youtuber.lastRevision = revision.originOf || revision;

                return manager.save(YoutuberEntity, youtuber);
            },
        );
    }

    async propose(
        currentUser: CurrentUser,
        { categories, socialMedia, ...propose }: ProposeYoutuberInput,
    ) {
        return this.youtuberProposalRepository.save({
            ...propose,
            ...(await this.proposalService.commonMaps(
                propose.content,
                socialMedia,
                categories,
            )),
            editedBy: currentUser,
        });
    }
}
