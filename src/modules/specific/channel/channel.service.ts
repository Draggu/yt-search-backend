import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { MarkdownMentionService } from 'modules/generic/markdown-mention/markdown-mention.service';
import { CreateOpinionInput } from 'modules/generic/opinion/dto/create-opinion.input';
import { OpinionService } from 'modules/generic/opinion/opinion.service';
import { socialMedia2Map } from 'modules/generic/social-media/helpers/to-map';
import { Youtube } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { EntityManager, Repository } from 'typeorm';
import { CategorieService } from '../categorie/categorie.service';
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
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly youtube: Youtube,
        private readonly markdownMentionService: MarkdownMentionService,
        private readonly opinionService: OpinionService,
        private readonly categorieService: CategorieService,
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
        edit?: ProposeChannelInput,
    ) {
        const proposal = await this.channelProposalRepository.findOneOrFail({
            where: { id },
            relations: {
                editedBy: true,
                categories: true,
            },
        });

        const { ytId, id: _, isRejected: __, ...revisionData } = proposal;

        const revision = edit
            ? {
                  ...edit,
                  mentions: await this.markdownMentionService.getMentions(
                      edit.content,
                  ),
                  socialMedia: socialMedia2Map(edit.socialMedia),
                  categories: await this.categorieService.assertAreLeafsAndMap(
                      edit.categories,
                  ),
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
            const channel = await manager
                .findOne(ChannelEntity, {
                    where: {
                        ytId,
                    },
                })
                .then(
                    async (channel) =>
                        channel ||
                        manager.save(ChannelEntity, {
                            ytId,
                            name: await this.fetchChannelFromYT(ytId).then(
                                ({ title }) => title!,
                            ),
                            opinionTarget: this.opinionService.createTarget(),
                        }),
                );

            await manager.remove(ChannelProposalEntity, proposal);

            channel.lastRevision = await manager.save(ChannelRevisionEntity, {
                ...revision,
                channel,
            });

            return manager.save(ChannelEntity, channel);
        });
    }

    async propose(
        currentUser: CurrentUser,
        { categories, content, ytId, socialMedia }: ProposeChannelInput,
    ) {
        // check if channel exists
        await this.fetchChannelFromYT(ytId);

        return this.channelProposalRepository.save({
            categories: await this.categorieService.assertAreLeafsAndMap(
                categories,
            ),
            content,
            editedBy: currentUser,
            ytId,
            socialMedia: socialMedia2Map(socialMedia),
            mentions: await this.markdownMentionService.getMentions(content),
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
