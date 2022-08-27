import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import * as _ from 'lodash';
import { Youtube } from 'modules/infrastructure/youtube-api/youtube-api.module';
import { EntityManager } from 'typeorm';
import { ChannelEntity } from '../entities/channel.entity';

@Injectable()
export class RefetchChannelScheduler implements OnModuleInit {
    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly config: ConfigService,
        private readonly youtube: Youtube,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}

    onModuleInit() {
        const job = new CronJob(
            this.config.getOrThrow('CHANNEL_REFETCH_CRON_TIME'),
            () => {
                this.entityManager.transaction(async (manager) => {
                    const channels = await manager
                        .createQueryBuilder(ChannelEntity, 'channel')
                        .setLock('pessimistic_write')
                        .orderBy({
                            lastRefetch: 'ASC',
                        })
                        .take(
                            +this.config.getOrThrow(
                                'CHANNEL_REFETCH_CHUNK_SIZE',
                            ),
                        )
                        .getMany();

                    const res = await this.youtube.channels.list({
                        id: channels.map((channel) => channel.ytId),
                        part: ['snippet'],
                    });

                    const channelsById = _.keyBy(
                        channels,
                        (channel) => channel.ytId,
                    );

                    const ytResponseData = res.data.items;

                    if (ytResponseData) {
                        await manager.getRepository(ChannelEntity).save(
                            ytResponseData.map((channel) => ({
                                ...channelsById[channel.id!],
                                name: channel.snippet!.title!,
                                lastRefetch: new Date(),
                            })),
                        );
                    }
                });
            },
        );

        this.schedulerRegistry.addCronJob('refetch-channel', job);

        job.start();
    }
}
