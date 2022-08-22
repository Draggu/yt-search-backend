import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as assert from 'assert';
import { marked } from 'marked';
import { ArticleEntity } from 'modules/specific/article/entities/article.entity';
import { ChannelEntity } from 'modules/specific/channel/entities/channel.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { YoutuberEntity } from 'modules/specific/youtuber/entities/youtuber.entity';
import { EntityManager, EntityTarget } from 'typeorm';
import { MentionsList } from './types';

@Injectable()
export class MarkdownMentionService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async getMentions(md: string) {
        const ids: MentionsList = {
            user: [],
            article: [],
            youtuber: [],
            channel: [],
        };

        marked(md, {
            walkTokens(token) {
                if (token.type === 'link') {
                    const match =
                        /^mention:\/(user|article|youtuber|channel)\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/.exec(
                            token.href,
                        );

                    if (match) {
                        const [_, kind, id] = match;

                        ids[
                            kind as 'user' | 'article' | 'youtuber' | 'channel'
                        ].push(id);
                    }
                }
            },
        });

        // prettier-ignore
        await this.findAndAssert(YoutuberEntity, 'id', ids.youtuber, 'youtuber');
        await this.findAndAssert(UserEntity, 'id', ids.user, 'user');
        await this.findAndAssert(ChannelEntity, 'ytId', ids.channel, 'channel');
        await this.findAndAssert(ArticleEntity, 'id', ids.article, 'article');

        return ids;
    }

    private async findAndAssert<T extends object>(
        entity: EntityTarget<T>,
        id: keyof T & string,
        ids: string[],
        name: string,
    ) {
        const entities = await this.entityManager
            .createQueryBuilder(entity, 'e')
            .select(id)
            .whereInIds(ids)
            .getMany();

        const foundIds = new Set<string>(
            entities.map((entity) => this.entityManager.getId(entity)),
        );

        ids.forEach((id) => {
            assert(foundIds.has(id), `${name} with id: ${id} not found`);
        });
    }
}
