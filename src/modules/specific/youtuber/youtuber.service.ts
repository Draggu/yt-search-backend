import { Injectable } from '@nestjs/common';
import { CurrentUser } from 'directives/auth/types';
import { ProposeYoutuberInput } from './dto/propose-youtuber.input';

@Injectable()
export class YoutuberService {
    propose(
        currentUser: CurrentUser,
        proposeYoutuberInput: ProposeYoutuberInput,
    ) {
        return 1 as any; //TODO
    }

    findOne(id: string) {
        return 1 as any; //TODO
    }
}
