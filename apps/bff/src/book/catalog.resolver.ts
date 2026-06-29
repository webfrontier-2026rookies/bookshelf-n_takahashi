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

  // 🔗 gRPCクライアント（catalog-serviceと喋るためのプラグ）を注入
  constructor(@Inject("CATALOG_PACKAGE") private client: ClientGrpc) {}

  onModuleInit() {
    // catalog.proto に書かれているサービスと接続
    this.catalogService =
      this.client.getService<CatalogServiceClient>("CatalogService");
  }

  /**
   * 🔍 1. 書籍一覧取得の窓口（GraphQLのクエリ）
   * 🎯 ここに @Query() を書くことで、schema.gqlに「listBooks」が自動追加されます！
   */
  @Query(() => [Book], { name: "listBooks" })
  async listBooks() {
    // gRPC経由で、さきほど作った catalog-service のコントローラーを呼び出す
    const response = await lastValueFrom(this.catalogService.listBooks({}));
    return response.books; // コントローラーがオブジェクトで包んでくれた { books: [...] } から配列を取り出して返す
  }
}
