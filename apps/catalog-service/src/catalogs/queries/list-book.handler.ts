import { Injectable } from "@nestjs/common";
import { CatalogRepository } from "../commands/register/book-repository";

@Injectable()
export class ListBooksHandler {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute() {
    //全件取得処理を呼び出す
    return this.catalogRepository.findMany();
  }
}
