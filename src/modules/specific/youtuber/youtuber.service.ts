import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { MarkdownMentionService } from 'modules/generic/markdown-mention/markdown-mention.service';
import { CreateOpinionInput } from 'modules/generic/opinion/dto/create-opinion.input';
import { OpinionService } from 'modules/generic/opinion/opinion.service';
import { socialMedia2Map } from 'modules/generic/social-media/helpers/to-map';
import { EntityManager, Repository } from 'typeorm';
import { CategorieService } from '../categorie/categorie.service';
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
        private readonly markdownMentionService: MarkdownMentionService,
        private readonly opinionService: OpinionService,
        private readonly categorieService: CategorieService,
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
                youtuber: true,
            },
        });

        const {
            youtuber: _youtuber,
            id: _,
            isRejected: __,
            ...revisionData
        } = proposal;

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
            const youtuber =
                _youtuber ||
                (await manager.save(
                    YoutuberEntity,
                    this.youtuberRepository.create({
                        opinionTarget: this.opinionService.createTarget(),
                    }),
                ));

            await manager.remove(YoutuberProposalEntity, proposal);

            youtuber.lastRevision = await manager.save(YoutuberRevisionEntity, {
                ...revision,
                youtuber,
            });

            return manager.save(YoutuberEntity, youtuber);
        });
    }

    async propose(
        currentUser: CurrentUser,
        { categories, socialMedia, ...propose }: ProposeYoutuberInput,
    ) {
        return this.youtuberProposalRepository.save({
            ...propose,
            editedBy: currentUser,
            categories: await this.categorieService.assertAreLeafsAndMap(
                categories,
            ),
            socialMedia: socialMedia2Map(socialMedia),
            mentions: await this.markdownMentionService.getMentions(
                propose.content,
            ),
        });
    }
}
