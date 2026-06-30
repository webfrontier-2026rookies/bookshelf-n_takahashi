import { Resolver, Field, ObjectType, Query } from "@nestjs/graphql";
import { Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable, lastValueFrom } from "rxjs";

@ObjectType()
export class Book {
  @Field() id!: string;
  @Field() title!: string;
  @Field() author!: string;
}

interface CatalogServiceClient {
  listBooks(data: {}): Observable<{ books: Book[] }>;
}

@Resolver(() => Book)
export class CatalogResolver implements OnModuleInit {
  private catalogService!: CatalogServiceClient;

  //gRPCクライアント（catalog-serviceと喋るためのプラグ）を注入
  constructor(@Inject("CATALOG_PACKAGE") private client: ClientGrpc) {}

  onModuleInit() {
    this.catalogService =
      this.client.getService<CatalogServiceClient>("CatalogService");
  }

  //書籍一覧取得の窓口（GraphQLのクエリ）
  @Query(() => [Book], { name: "listBooks" })
  async listBooks() {
    const response = await lastValueFrom(this.catalogService.listBooks({}));
    return response.books;
  }
}
