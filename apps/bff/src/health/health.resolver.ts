import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Query, Resolver } from '@nestjs/graphql';
import { firstValueFrom, Observable } from 'rxjs';
import { CATALOG_PACKAGE, USER_PACKAGE } from '../grpc/grpc.constants';

// health.proto の service Health のクライアント側インターフェース。
// gRPC メソッドは NestJS では Observable を返す。
interface HealthGrpcClient {
  ping(data: { message: string }): Observable<{ message: string; service: string }>;
}

@Resolver()
export class HealthResolver implements OnModuleInit {
  private userHealth!: HealthGrpcClient;
  private catalogHealth!: HealthGrpcClient;

  constructor(
    @Inject(USER_PACKAGE) private readonly userClient: ClientGrpc,
    @Inject(CATALOG_PACKAGE) private readonly catalogClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userHealth = this.userClient.getService<HealthGrpcClient>('Health');
    this.catalogHealth = this.catalogClient.getService<HealthGrpcClient>('Health');
  }

  // フロント → BFF(GraphQL) → 各サービス(gRPC) の疎通を1クエリで確認する。
  @Query(() => String, {
    description: 'フロント→BFF→gRPCサービスの疎通確認用クエリ',
  })
  async health(): Promise<string> {
    const [user, catalog] = await Promise.all([
      firstValueFrom(this.userHealth.ping({ message: 'from bff' })),
      firstValueFrom(this.catalogHealth.ping({ message: 'from bff' })),
    ]);

    return [
      'BFF OK',
      `${user.service}: ${user.message}`,
      `${catalog.service}: ${catalog.message}`,
    ].join(' | ');
  }
}
