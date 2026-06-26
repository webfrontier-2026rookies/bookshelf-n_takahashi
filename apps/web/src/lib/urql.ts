import { createClient, cacheExchange, fetchExchange, Client } from "urql";
import { useAuthStore } from "@/stores/auth";

const bffUrl = process.env.NEXT_PUBLIC_BFF_URL ?? "http://localhost:4000";

export const urqlClient: Client = createClient({
  url: `${bffUrl}/graphql`,
  exchanges: [cacheExchange, fetchExchange],

  //認証実装後、fetchOptions で Authorization ヘッダ(JWT)を付与する
  fetchOptions: () => {
    // 1. Zustandのストアから最新のトークンを取得
    const token = useAuthStore.getState().token;

    return {
      headers: (token ? { Authorization: `Bearer ${token}` } : {}) as Record<
        string,
        string
      >,
    };
  },
});
