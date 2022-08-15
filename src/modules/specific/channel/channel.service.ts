import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { Youtube } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { Repository } from 'typeorm';
import { ChannelProposalInput } from './dto/channel-proposal.input';
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
        @InjectRepository(ChannelRevisionEntity)
        private readonly channelRevisionRepository: Repository<ChannelRevisionEntity>,
        private readonly youtube: Youtube,
    ) {}

    findOne(ytId: string) {
        return this.channelRepository.findOne({
            where: { ytId },
        });
    }

    findProposals({ skip, take }: PageInput, ytId?: string) {
        return this.channelProposalRepository.find({
            skip,
            take,
            where: { ytId, isRejected: false },
        });
    }

    rejectProposal(id: string): Promise<ChannelProposalEntity | undefined> {
        return this.channelProposalRepository
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
        edit?: ChannelProposalInput,
    ) {
        const {
            id: proposalId,
            ytId,
            isRejected: _,
            ...revisionData
        } = await this.channelProposalRepository.findOneOrFail({
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

        const channel =
            (await this.channelRepository.findOne({
                where: {
                    ytId,
                },
            })) ||
            (await this.channelRepository.save({
                ytId,
                name: await this.fetchChannelFromYT(ytId).then(
                    ({ title }) => title!,
                ),
            }));

        await this.channelRevisionRepository.save({
            ...revision,
            channel,
        });

        return channel;
    }

    async propose(
        currentUser: CurrentUser,
        { categories, description, ytId }: ChannelProposalInput,
    ) {
        // check if channel exists
        await this.fetchChannelFromYT(ytId);

        return this.channelProposalRepository.save({
            categories: categories.map((id) => ({ id })),
            description,
            editedBy: currentUser,
            ytId,
        });
    }

    private async fetchChannelFromYT(ytId: string) {
        const res = await this.youtube.channels.list({
            id: [ytId],
            part: ['snippet'],
        });

        const channel = res.data.items?.[0];

        if (channel) {
            return channel.snippet!;
        } else {
            throw new Error(`youtube not found channel with id: ${ytId}`);
        }
    }
}
