import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { RegisterBookDto } from "../../commands/register/register-book.dto";
import { ulid } from "ulid";

@Injectable()
export class CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  //書籍を新しくデータベースに保存する
  async create(data: RegisterBookDto, userId: string) {
    return this.prisma.book.create({
      data: {
        id: ulid(),
        title: data.title,
        author: data.author,
        createdByUserId: userId,
      },
    });
  }

  //登録されている書籍を全件取得する
  async findMany() {
    return this.prisma.book.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  //指定されたIDの書籍を1件だけ取得する
  async findUnique(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }
}
