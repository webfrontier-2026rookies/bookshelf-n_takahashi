import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { CatalogResolver } from "./catalog.resolver";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "CATALOG_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "catalog",
          protoPath: join(
            process.cwd(),
            "../../packages/proto/src/catalog.proto",
          ),
        },
      },
    ]),
  ],
  providers: [CatalogResolver],
})
export class BookModule {}
