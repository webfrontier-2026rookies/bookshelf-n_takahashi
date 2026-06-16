import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CATALOG_PACKAGE,
  HEALTH_PACKAGE_NAME,
  USER_PACKAGE,
} from '../grpc/grpc.constants';
import { HealthResolver } from './health.resolver';

const protoPath = require.resolve('@bookshelf/proto/health.proto');

@Module({
  imports: [
    // BFF は gRPC「クライアント」として各マイクロサービスへ接続する。
    ClientsModule.register([
      {
        name: USER_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: HEALTH_PACKAGE_NAME,
          protoPath,
          url: process.env.USER_SERVICE_URL ?? 'localhost:50051',
        },
      },
      {
        name: CATALOG_PACKAGE,
        transport: Transport.GRPC,
        options: {
          package: HEALTH_PACKAGE_NAME,
          protoPath,
          url: process.env.CATALOG_SERVICE_URL ?? 'localhost:50052',
        },
      },
    ]),
  ],
  providers: [HealthResolver],
})
export class HealthModule {}
