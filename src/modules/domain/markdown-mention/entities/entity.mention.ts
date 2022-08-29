import { Field, ObjectType } from '@nestjs/graphql';
import { ArticleEntity } from 'modules/domain/article/entities/article.entity';
import { ChannelEntity } from 'modules/domain/channel/entities/channel.entity';
import { UserEntity } from 'modules/domain/user/entities/user.entity';
import { YoutuberEntity } from 'modules/domain/youtuber/entities/youtuber.entity';

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
