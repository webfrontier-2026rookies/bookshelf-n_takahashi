import { HealthController } from './health.controller';

// 疎通確認ハンドラの最小ユニットテスト。
// 学習者はこの形を参考に commands（SignUp/Login 等）のテストを書く。
describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('Ping は自サービス名を返す', () => {
    const res = controller.ping({ message: 'hello' });
    expect(res.service).toBe('user-service');
  });

  it('Ping は受け取ったメッセージを含む pong を返す', () => {
    const res = controller.ping({ message: 'hello' });
    expect(res.message).toContain('pong');
    expect(res.message).toContain('hello');
  });
});
