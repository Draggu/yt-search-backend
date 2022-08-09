import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { youtube_v3 } from 'googleapis';
import { Repository } from 'typeorm';
import { ChannelProposalInput } from './dto/channel-proposal.input';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelService {
    private readonly yt = new youtube_v3.Youtube({});

    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
    ) {}

    findOne(ytId: string) {
        return this.channelRepository.findOne({
            where: { ytId },
        });
    }

    async propose(
        currentUser: CurrentUser,
        { categories, description, ytId }: ChannelProposalInput,
    ) {
        return this.channelRepository.save({
            newestContent: {
                categories: categories.map((id) => ({ id })),
                description,
                editedBy: currentUser,
            },
            name: await this.fetchChannelFromYT(ytId).then(
                ({ title }) => title!,
            ),
            ytId,
        });
    }

    private async fetchChannelFromYT(ytId: string) {
        const res = await this.yt.channels.list({
            id: [ytId],
            part: ['snippet'],
        });

        const channel = res.data.items?.[0];

        if (channel) {
            return channel.snippet!;
        } else {
            throw new NotFoundException();
        }
    }
}
