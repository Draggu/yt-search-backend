import { Injectable, Type } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { promiseAllSlowFail } from 'helpers/promise-all-slow-fails';
import { EntityManager, EntityTarget } from 'typeorm';
import { CategorieService } from '../categorie/categorie.service';
import { MarkdownMentionService } from '../markdown-mention/markdown-mention.service';
import { SocialMediaObject } from '../social-media/dto/social-media.input';
import { socialMedia2Map } from '../social-media/helpers/to-map';

@Injectable()
export class ProposalService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly markdownMentionService: MarkdownMentionService,
        private readonly categorieService: CategorieService,
    ) {}

    rejectProposal<T extends { isRejected: boolean }>(
        entity: EntityTarget<T>,
        id: string,
    ): Promise<T | undefined> {
        return this.entityManager
            .createQueryBuilder(entity, 'e')
            .update({ isRejected: () => 'true' })
            .where({
                id,
            })
            .returning('*')
            .execute()
            .then(({ raw }) => raw[0]);
    }

    findProposals<T extends { isRejected: boolean }>(
        entity: Type<T>,
        { skip, take }: PageInput,
        idObject?: Partial<T>,
    ) {
        return this.entityManager
            .createQueryBuilder(entity, 'e')
            .skip(skip)
            .take(take)
            .where({ ...idObject, isRejected: false })
            .getMany();
    }

    async commonMaps(
        content: string,
        socialMedia: SocialMediaObject[],
        categoriesIds: string[],
    ) {
        const [mentions, categories] = await promiseAllSlowFail([
            this.markdownMentionService.getMentions(content),
            this.categorieService.areLeafsAssertAndMap(categoriesIds),
        ]);

        return {
            mentions,
            categories,
            socialMedia: socialMedia2Map(socialMedia),
        };
    }
}
