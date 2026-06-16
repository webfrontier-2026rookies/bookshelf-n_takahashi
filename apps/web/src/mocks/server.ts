import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Node 環境（ユニット/結合テスト）でのモック用サーバ。
// テストの setup で server.listen() / afterEach(server.resetHandlers) / server.close() する。
export const server = setupServer(...handlers);
