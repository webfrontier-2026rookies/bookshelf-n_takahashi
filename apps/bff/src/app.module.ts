import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { join } from "path";
import { HealthModule } from "./health/health.module";
import { UserResolver } from "./users/user.resolver";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { BookModule } from "./book/book.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ClientsModule.registerAsync([
      {
        name: "USER_PACKAGE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: "user",
            protoPath: join(
              process.cwd(),
              "../../packages/proto/src/user.proto",
            ),
            url: configService.get<string>(
              "USER_SERVICE_URL",
              "localhost:50051",
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      graphiql: true,
      sortSchema: true,
    }),
    HealthModule,
    BookModule,
  ],
  providers: [UserResolver],
})
export class AppModule {}
