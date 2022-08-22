import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQlModuleConfig } from 'config/graphql.module.config';
import { TypeOrmModuleConfig } from 'config/typeorm.module.config';
import { DirectivesModule } from 'directives/directives.module';
import { AuthModule } from 'modules/specific/auth/auth.module';
import { ChannelModule } from 'modules/specific/channel/channel.module';
import { UserModule } from 'modules/specific/user/user.module';
import { YoutuberModule } from 'modules/specific/youtuber/youtuber.module';
import { ArticleModule } from './modules/specific/article/article.module';
import { CategorieModule } from './modules/specific/categorie/categorie.module';
import { SearchModule } from './modules/specific/search/search.module';

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
