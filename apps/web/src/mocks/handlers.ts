import { graphql, HttpResponse } from 'msw';

// API モックの定義。実際の BFF を起動せずに画面・Storybook・テストを動かせる。
// 学習者は books / login などのクエリ・ミューテーションのモックをここに追加する。
export const handlers = [
  // health クエリのモック応答
  graphql.query('Health', () => {
    return HttpResponse.json({
      data: {
        health: 'BFF OK (mocked) | user-service: pong | catalog-service: pong',
      },
    });
  }),
];
