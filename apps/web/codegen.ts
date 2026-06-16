import type { CodegenConfig } from '@graphql-codegen/cli';

// GraphQL Codegen 設定（雛形）。
// BFF を起動した状態で `pnpm --filter web codegen` を実行すると、
// クエリ/ミューテーションの型と URQL 用フックが src/gql 配下に生成される。
const bffUrl = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:4000';

const config: CodegenConfig = {
  schema: `${bffUrl}/graphql`,
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
};

export default config;
