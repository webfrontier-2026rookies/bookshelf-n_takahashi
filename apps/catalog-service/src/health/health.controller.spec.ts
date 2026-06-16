import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('Ping は自サービス名を返す', () => {
    const res = controller.ping({ message: 'hello' });
    expect(res.service).toBe('catalog-service');
  });

  it('Ping は受け取ったメッセージを含む pong を返す', () => {
    const res = controller.ping({ message: 'hello' });
    expect(res.message).toContain('pong');
    expect(res.message).toContain('hello');
  });
});
