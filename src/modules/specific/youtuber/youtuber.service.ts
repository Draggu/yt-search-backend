import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { ProposeYoutuberInput } from './dto/propose-youtuber.input';
import { YoutuberEntity } from './entities/youtuber.entity';

@Injectable()
export class YoutuberService {
    constructor(
        @InjectRepository(YoutuberEntity)
        private readonly youtuberRepository: Repository<YoutuberEntity>,
    ) {}

    propose(
        currentUser: CurrentUser,
        {
            categories,
            description,
            name,
            birthday,
            realName,
        }: ProposeYoutuberInput,
    ) {
        return this.youtuberRepository.save({
            newestContent: {
                description,
                name,
                birthday,
                realName,
                editedBy: currentUser,
                categories: categories.map((id) => ({ id })),
            },
        });
    }

    findOne(id: string) {
        return this.youtuberRepository.findOne({ where: { id } });
    }
}
