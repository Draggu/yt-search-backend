import { PipeTransform } from '@nestjs/common';
import assert from 'assert';

export class RemoveNullsPipe implements PipeTransform {
    transform(value: unknown) {
        assert(value && typeof value === 'object');

        return Object.fromEntries(
            Object.entries(value).filter(
                ([_, value]) => value !== null && value !== undefined,
            ),
        );
    }
}
