import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { join } from "path";
import { HealthModule } from "./health/health.module";
import { UserResolver } from "./users/user.resolver";

@Module({
  imports: [
    // コードファースト: リゾルバの型定義から schema.gql を自動生成する。
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      graphiql: true, // http://localhost:4000/graphiql でクエリを試せる
      sortSchema: true,
    }),
    HealthModule,
    // TODO(学習者): AuthModule / BookModule / ReviewModule を追加し、
    //               DataLoader をここ（BFF）で実装して N+1 を解消する。
  ],
  providers: [UserResolver],
})
export class AppModule {}
