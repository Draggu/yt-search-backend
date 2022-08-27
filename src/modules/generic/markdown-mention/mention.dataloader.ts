import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
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
            const [users, articles, youtubers, channels] = await Promise.all([
                entityManager.find(UserEntity, {
                    where: {
                        id: In(mentions.flatMap((mention) => mention.user)),
                    },
                }),
                entityManager.find(ArticleEntity, {
                    where: {
                        id: In(mentions.flatMap((mention) => mention.article)),
                    },
                }),
                entityManager.find(YoutuberEntity, {
                    where: {
                        id: In(mentions.flatMap((mention) => mention.youtuber)),
                    },
                }),
                entityManager.find(ChannelEntity, {
                    where: {
                        ytId: In(
                            mentions.flatMap((mention) => mention.channel),
                        ),
                    },
                }),
            ]);

            const usersMap = _.keyBy(users, (user) => user.id);
            const articlesMap = _.keyBy(articles, (article) => article.id);
            const youtubersMap = _.keyBy(youtubers, (youtuber) => youtuber.id);
            const channelsMap = _.keyBy(channels, (channel) => channel.ytId);

            return mentions.map((mention) => ({
                users: mention.user.map((id) => usersMap[id]),
                articles: mention.article.map((id) => articlesMap[id]),
                youtubers: mention.youtuber.map((id) => youtubersMap[id]),
                channels: mention.channel.map((id) => channelsMap[id]),
            }));
        });
    }
}
