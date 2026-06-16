import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// ブラウザ（開発時 / Storybook）でのモック用ワーカー。
// 利用前に一度 `pnpm --filter web msw:init` で public/mockServiceWorker.js を生成すること。
export const worker = setupWorker(...handlers);
