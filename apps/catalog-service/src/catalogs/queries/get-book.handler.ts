import { Injectable, NotFoundException } from "@nestjs/common";
import { CatalogRepository } from "../commands/register/book-repository";

@Injectable()
export class GetBookHandler {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(id: string) {
    const book = await this.catalogRepository.findUnique(id);

    //指定されたIDの本が見つからなかった場合
    if (!book) {
      throw new NotFoundException(
        `指定された書籍（ID: ${id}）は見つかりませんでした。`,
      );
    }

    return book;
  }
}
