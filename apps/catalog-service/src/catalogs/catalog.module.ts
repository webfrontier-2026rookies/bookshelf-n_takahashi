import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CatalogController } from "src/catalogs/book.controller";
import { ListBooksHandler } from "src/catalogs/queries/list-book.handler";
import { RegisterBookHandler } from "src/catalogs/commands/register/register-book.handler";
import { CatalogRepository } from "src/catalogs/commands/register/book-repository";
import { GetBookHandler } from "src/catalogs/queries/get-book.handler";

@Module({
  imports: [],
  controllers: [CatalogController], // 🎯 ココにコントローラーを追加！
  providers: [
    PrismaService,
    CatalogRepository,
    RegisterBookHandler,
    ListBooksHandler,
    GetBookHandler,
  ],
})
export class CatalogModule {}
