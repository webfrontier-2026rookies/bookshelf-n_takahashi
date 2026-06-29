import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { join } from "path";
import { HealthModule } from "./health/health.module";
import { UserResolver } from "./users/user.resolver";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { BookModule } from "./book/book.module";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "user",
          protoPath: join(process.cwd(), "../../packages/proto/src/user.proto"),
          url: process.env.USER_SERVICE_URL,
        },
      },
    ]),
    //resolver.tsの型定義からschema.gql を自動生成
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      graphiql: true,
      sortSchema: true,
    }),
    HealthModule,
    // TODO(学習者): AuthModule / BookModule / ReviewModule を追加し、
    //               DataLoader をここ（BFF）で実装して N+1 を解消する。
    BookModule,
  ],
  providers: [UserResolver],
})
export class AppModule {}
