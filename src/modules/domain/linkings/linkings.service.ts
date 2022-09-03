import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { CreateLinkingInput } from './dto/create-linking.input';
import { LinkingProposalEntity } from './entities/linking-proposal.entity';
import { LinkingEntity } from './entities/linking.entity';

@Injectable()
export class LinkingsService {
    constructor(
        @InjectRepository(LinkingProposalEntity)
        private readonly linkingProposalRepository: Repository<LinkingProposalEntity>,
    ) {}

    findAll(page: PageInput) {
        return this.linkingProposalRepository.find(page);
    }

    proposeLinking(
        currentUser: CurrentUser,
        { youtuberId, channelYtId }: CreateLinkingInput,
    ) {
        return this.linkingProposalRepository.save({
            channel: {
                ytId: channelYtId,
            },
            youtuber: {
                id: youtuberId,
            },
            proposedBy: currentUser,
        });
    }

    async acceptLinking(currentUser: CurrentUser, id: string) {
        const {
            createdAt,
            isRemoving,
            id: _,
            ...proposal
        } = await this.linkingProposalRepository
            .createQueryBuilder()
            .where({ id })
            .loadAllRelationIds({
                disableMixedMap: true,
            })
            .getOneOrFail();

        await this.linkingProposalRepository.manager.transaction(
            async (manager) => {
                await this.removeProposal(currentUser, id, manager);

                if (isRemoving) {
                    await manager
                        .createQueryBuilder(LinkingProposalEntity, 'p')
                        .delete()
                        .where(proposal)
                        .execute();
                } else {
                    await manager.save(LinkingEntity, {
                        ...proposal,
                        acceptedBy: currentUser,
                    });
                }
            },
        );

        return id;
    }

    rejectLinking(currentUser: CurrentUser, id: string) {
        return this.removeProposal(currentUser, id);
    }

    private removeProposal(
        currentUser: CurrentUser,
        id: string,
        manager = this.linkingProposalRepository.manager,
    ) {
        return manager.remove(
            LinkingProposalEntity,
            manager.create(LinkingProposalEntity, {
                id,
            }),
        );
    }
}
