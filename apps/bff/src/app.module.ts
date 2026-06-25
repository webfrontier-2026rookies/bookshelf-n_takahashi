import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { join } from "path";
import { HealthModule } from "./health/health.module";
import { UserResolver } from "./users/user.resolver";
import { credentials } from "@grpc/grpc-js";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "user",
          protoPath: join(process.cwd(), "../../packages/proto/src/user.proto"), // ⚠️ プロジェクトの user.proto の本物の位置に合わせてパスを微調整してください
          url: "localhost:50051",
        },
      },
    ]),
    // コードファースト: リゾルバの型定義から schema.gql を自動生成する。
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      graphiql: true,
      sortSchema: true,
    }),
    HealthModule,
    // TODO(学習者): AuthModule / BookModule / ReviewModule を追加し、
    //               DataLoader をここ（BFF）で実装して N+1 を解消する。
  ],
  providers: [UserResolver],
})
export class AppModule {}
