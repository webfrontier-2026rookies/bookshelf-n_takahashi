import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const protoPath = require.resolve("@bookshelf/proto/health.proto");
  const url = process.env.CATALOG_SERVICE_GRPC_URL ?? "0.0.0.0:50052";

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "health",
        protoPath,
        url,
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log(`[catalog-service] gRPC listening on ${url}`);
}

bootstrap();
