import { Resolver } from '@nestjs/graphql';
import { ChannelProposalEntity } from '../entities/channel-proposal.entity';
import { ChannelRevisionProposalCommonFieldResolver } from './channel-revision-proposal-common.field-resolver';

@Resolver(() => ChannelProposalEntity)
export class ChannelProposalFieldResolver extends ChannelRevisionProposalCommonFieldResolver(
    ChannelProposalEntity,
) {}
