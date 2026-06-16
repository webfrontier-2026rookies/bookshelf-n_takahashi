// gRPC クライアントの DI トークン。
// 学習者が新しいサービス呼び出しを追加する際もここに集約すると見通しがよい。
export const USER_PACKAGE = 'USER_PACKAGE';
export const CATALOG_PACKAGE = 'CATALOG_PACKAGE';

// proto の package 名（health.proto の `package health;` に対応）
export const HEALTH_PACKAGE_NAME = 'health';
