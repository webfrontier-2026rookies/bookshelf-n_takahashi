import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { RegisterBookHandler } from "./commands/register/register-book.handler";
import { ListBooksHandler } from "../catalogs/queries/list-book.handler";
import { GetBookHandler } from "../catalogs/queries/get-book.handler";
import { RegisterBookDto } from "./commands/register/register-book.dto";

@Controller()
export class CatalogController {
  //3つのHandlerクラスのオブジェクトを合体
  constructor(
    private readonly registerBookHandler: RegisterBookHandler,
    private readonly listBooksHandler: ListBooksHandler,
    private readonly getBookHandler: GetBookHandler,
  ) {}

  @GrpcMethod("CatalogService", "RegisterBook")
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerBook(data: RegisterBookDto, metadata: any) {
    const userId = metadata.get("user-id")[0] || "system-user";
    return this.registerBookHandler.execute(data, userId);
  }

  //書籍一覧取得の窓口
  @GrpcMethod("CatalogService", "ListBooks")
  async listBooks() {
    const books = await this.listBooksHandler.execute();
    return { books };
  }

  //書籍詳細取得の窓口
  @GrpcMethod("CatalogService", "GetBook")
  async getBook(data: { id: string }) {
    return this.getBookHandler.execute(data.id);
  }
}
