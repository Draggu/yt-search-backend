# Youtube search backend

## Table of content

-   [Starting](#Starting)
-   [Schema](#Schema)
-   [Technologies](#Technologies)
-   [Features](#Features)

## Starting

run

```sh
docker compose up
```

graphql endpoint will be available at [http://localhost:8080/graphql]()

## Schema

All needed information to comunicate with server
are available in [schema.gql](schema.gql) file

## Features

-   proposal system (change can be proposed by anyone and then must be accepted)
-   hide system (allow hiding resources with tracking history)
-   revision system (every change is recorded)
-   detecting mentions in descriptions
-   users opinions
-   easy in use search engine
-   youtube integration scheduled data updates
-   granular permissions

## Technologies

-   [NestJS](https://nestjs.com/)
-   [GraphQL](https://graphql.org/)
-   [TypeORM](https://typeorm.io/)
-   [PostgreSQL](https://www.postgresql.org/)
