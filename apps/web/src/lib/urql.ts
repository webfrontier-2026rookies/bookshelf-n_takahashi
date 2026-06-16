import { createClient, cacheExchange, fetchExchange, Client } from 'urql';

const bffUrl = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:4000';

export const urqlClient: Client = createClient({
  url: `${bffUrl}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
  // TODO(学習者): 認証実装後、fetchOptions で Authorization ヘッダ(JWT)を付与する
  // fetchOptions: () => {
  //   const token = useAuthStore.getState().token;
  //   return token ? { headers: { authorization: `Bearer ${token}` } } : {};
  // },
});
