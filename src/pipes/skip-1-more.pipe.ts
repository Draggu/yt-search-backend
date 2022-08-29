import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as assert from 'assert';
import { PageInput } from 'common/dto/page';

export class Skip1MorePipe implements PipeTransform {
    transform(page: PageInput, metadata: ArgumentMetadata) {
        assert(
            metadata.metatype === PageInput,
            'Skip1MorePipe can be only used on PageInput',
        );

        return { ...page, skip: page.skip + 1 };
    }
}
