import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { ArticleEntity } from 'modules/specific/article/entities/article.entity';
import { ChannelEntity } from 'modules/specific/channel/entities/channel.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { YoutuberEntity } from 'modules/specific/youtuber/entities/youtuber.entity';
import { EntityManager, In } from 'typeorm';
import { MentionEntity } from './entities/entity.mention';
import { MentionsList } from './types';

@Injectable()
export class MentionDataloader extends DataLoader<MentionsList, MentionEntity> {
    constructor(@InjectEntityManager() entityManager: EntityManager) {
        super(async (mentions) => {
            const _users = await entityManager.find(UserEntity, {
                where: {
                    id: In(mentions.flatMap((mention) => mention.user)),
                },
            });
            const users = Object.fromEntries(
                _users.map((user) => [user.id, user]),
            );

            const _articles = await entityManager.find(ArticleEntity, {
                where: {
                    id: In(mentions.flatMap((mention) => mention.article)),
                },
            });
            const articles = Object.fromEntries(
                _articles.map((article) => [article.id, article]),
            );

            const _youtubers = await entityManager.find(YoutuberEntity, {
                where: {
                    id: In(mentions.flatMap((mention) => mention.youtuber)),
                },
            });
            const youtubers = Object.fromEntries(
                _youtubers.map((youtuber) => [youtuber.id, youtuber]),
            );

            const _channels = await entityManager.find(ChannelEntity, {
                where: {
                    ytId: In(mentions.flatMap((mention) => mention.channel)),
                },
            });
            const channels = Object.fromEntries(
                _channels.map((channel) => [channel.ytId, channel]),
            );

            return mentions.map((mention) => ({
                users: mention.user.map((id) => users[id]),
                articles: mention.article.map((id) => articles[id]),
                youtubers: mention.youtuber.map((id) => youtubers[id]),
                channels: mention.channel.map((id) => channels[id]),
            }));
        });
    }
}
