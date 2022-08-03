import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { ChannelProposalInput } from './dto/channel-proposal.input';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
    ) {}

    findOne(ytId: string) {
        return this.channelRepository.findOne({
            where: { ytId },
        });
    }

    propose(
        currentUser: CurrentUser,
        { categories, description, name, ytId }: ChannelProposalInput,
    ) {
        return this.channelRepository.save({
            newestContent: {
                categories: categories.map((id) => ({ id })),
                description,
                name,
                editedBy: currentUser,
            },
            ytId,
        });
    }
}
