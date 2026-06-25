import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  // 共有パッケージから .proto の絶対パスを解決する（pnpm workspace + exports map）
  const protoPath = require.resolve("@bookshelf/proto/health.proto");
  const url = process.env.GRPC_URL ?? "0.0.0.0:50051";
  const userProtoPath = require.resolve("@bookshelf/proto/user.proto");
  const healthProtoPath = require.resolve("@bookshelf/proto/health.proto");

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ["health", "user"],
        protoPath: [healthProtoPath, userProtoPath],
        url,
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log(`[user-service] gRPC listening on ${url}`);
}

bootstrap();
