import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQlModuleConfig } from 'config/graphql.module.config';
import { TypeOrmModuleConfig } from 'config/typeorm.module.config';
import { DirectivesModule } from 'directives/directives.module';
import { ArticleModule } from 'modules/domain/article/article.module';
import { AuthModule } from 'modules/domain/auth/auth.module';
import { CategorieModule } from 'modules/domain/categorie/categorie.module';
import { ChannelModule } from 'modules/domain/channel/channel.module';
import { SearchModule } from 'modules/domain/search/search.module';
import { UserModule } from 'modules/domain/user/user.module';
import { YoutuberModule } from 'modules/domain/youtuber/youtuber.module';

@Module({
    imports: [
        ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useClass: GraphQlModuleConfig,
            imports: [DirectivesModule],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmModuleConfig,
        }),
        ScheduleModule.forRoot(),
        UserModule,
        AuthModule,
        YoutuberModule,
        ChannelModule,
        ArticleModule,
        CategorieModule,
        SearchModule,
    ],
})
export class AppModule {}
