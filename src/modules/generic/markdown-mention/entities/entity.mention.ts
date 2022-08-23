import { Field, ObjectType } from '@nestjs/graphql';
import { ArticleEntity } from 'modules/specific/article/entities/article.entity';
import { ChannelEntity } from 'modules/specific/channel/entities/channel.entity';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { YoutuberEntity } from 'modules/specific/youtuber/entities/youtuber.entity';

@ObjectType()
export class MentionEntity {
    @Field(() => [UserEntity])
    users: UserEntity[];

    @Field(() => [ArticleEntity])
    articles: ArticleEntity[];

    @Field(() => [YoutuberEntity])
    youtubers: YoutuberEntity[];

    @Field(() => [ChannelEntity])
    channels: ChannelEntity[];
}
