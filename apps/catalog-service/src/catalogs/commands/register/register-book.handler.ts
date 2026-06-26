import { Injectable } from "@nestjs/common";
import { CatalogRepository } from "../register/book-repository";
import { RegisterBookDto } from "./register-book.dto";

@Injectable()
export class RegisterBookHandler {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async execute(dto: RegisterBookDto, userId: string) {
    //リポジトリの登録処理を呼び出す
    return this.catalogRepository.create(dto, userId);
  }
}
