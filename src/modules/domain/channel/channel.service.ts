import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as assert from 'assert';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { CreateOpinionInput } from 'modules/domain/opinion/dto/create-opinion.input';
import { OpinionService } from 'modules/domain/opinion/opinion.service';
import { Youtube } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { Repository } from 'typeorm';
import { ProposalService } from '../proposal/proposal.service';
import { ProposeChannelInput } from './dto/propose-channel.input';
import { ChannelProposalEntity } from './entities/channel-proposal.entity';
import { ChannelRevisionEntity } from './entities/channel-revision.entity';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
        @InjectRepository(ChannelProposalEntity)
        private readonly channelProposalRepository: Repository<ChannelProposalEntity>,
        private readonly opinionService: OpinionService,
        private readonly proposalService: ProposalService,
        private readonly youtube: Youtube,
    ) {}

    async comment(
        channelId: string,
        createOpinionInput: CreateOpinionInput,
        currentUser?: CurrentUser,
    ) {
        return this.opinionService.create(
            createOpinionInput,
            await this.channelRepository
                .findOneOrFail({ where: { ytId: channelId } })
                .then((channel) => channel.opinionTarget.id),
            currentUser,
        );
    }

    findOne(ytId: string) {
        return this.channelRepository.findOne({
            where: { ytId },
        });
    }

    findProposals(page: PageInput, ytId?: string) {
        return this.proposalService.findProposals(ChannelProposalEntity, page, {
            ytId,
        });
    }

    rejectProposal(id: string) {
        return this.proposalService.rejectProposal(ChannelProposalEntity, id);
    }

    async acceptProposal(
        currentUser: CurrentUser,
        id: string,
        edit?: ProposeChannelInput,
    ) {
        return this.channelProposalRepository.manager.transaction(
            async (manager) => {
                const proposal = await manager
                    .createQueryBuilder(ChannelProposalEntity, 'p')
                    .loadAllRelationIds({
                        disableMixedMap: true,
                    })
                    .where({ id })
                    .setLock('pessimistic_write', undefined, [
                        manager.connection.getMetadata(ChannelProposalEntity)
                            .tableName,
                    ])
                    .getOneOrFail();

                const {
                    ytId,
                    id: _,
                    isRejected: __,
                    ...revisionData
                } = proposal;

                const channel =
                    (await manager.findOne(ChannelEntity, {
                        where: {
                            ytId,
                        },
                    })) ||
                    (await manager.save(ChannelEntity, {
                        ytId,
                        name: await this.fetchChannelFromYT(ytId).then(
                            ({ title }) => title!,
                        ),
                        opinionTarget: this.opinionService.createTarget(),
                    }));

                await manager.remove(ChannelProposalEntity, proposal);

                const revision = await manager.save(ChannelRevisionEntity, {
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
                              channel,
                          }
                        : undefined,
                    acceptedBy: currentUser,
                    channel,
                });

                channel.lastRevision = revision.originOf || revision;

                return manager.save(ChannelEntity, channel);
            },
        );
    }

    async propose(
        currentUser: CurrentUser,
        { categories, socialMedia, ...propose }: ProposeChannelInput,
    ) {
        // check if channel exists
        await this.fetchChannelFromYT(propose.ytId);

        return this.channelProposalRepository.save({
            ...propose,
            ...(await this.proposalService.commonMaps(
                propose.content,
                socialMedia,
                categories,
            )),
            editedBy: currentUser,
        });
    }

    private async fetchChannelFromYT(ytId: string) {
        const res = await this.youtube.channels.list({
            id: [ytId],
            part: ['snippet'],
        });

        const channel = res.data.items?.[0];

        assert(channel, `youtube not found channel with id: ${ytId}`);

        return channel.snippet!;
    }
}
