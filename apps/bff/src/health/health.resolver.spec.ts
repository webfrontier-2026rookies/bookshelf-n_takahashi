import { of } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { HealthResolver } from './health.resolver';

// gRPC クライアントをモックして、BFF の集約ロジックだけを検証する。
// 実サービスを起動せずにテストできる（依存はモックに差し替える）のがポイント。
function mockClient(service: string): ClientGrpc {
  return {
    getService: () => ({
      ping: () => of({ message: 'pong', service }),
    }),
    getClientByServiceName: () => ({}),
  } as unknown as ClientGrpc;
}

describe('HealthResolver', () => {
  it('health は各サービスの応答を1つの文字列に集約する', async () => {
    const resolver = new HealthResolver(
      mockClient('user-service'),
      mockClient('catalog-service'),
    );
    resolver.onModuleInit();

    const result = await resolver.health();

    expect(result).toContain('BFF OK');
    expect(result).toContain('user-service');
    expect(result).toContain('catalog-service');
  });
});
