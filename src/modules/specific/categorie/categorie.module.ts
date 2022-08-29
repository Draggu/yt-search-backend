import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorieResolver } from './categorie.resolver';
import { CategorieService } from './categorie.service';
import { CategorieEntity } from './entities/categorie.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategorieEntity])],
    providers: [CategorieResolver, CategorieService],
    exports: [CategorieService],
})
export class CategorieModule {}
