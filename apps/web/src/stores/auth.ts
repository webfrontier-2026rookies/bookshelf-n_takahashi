import { create } from "zustand";

// 認証状態のクライアントストア（雛形）。
// 学習者はログイン成功時に setToken を呼び、保護ページやヘッダ付与に利用する。
interface AuthState {
  token: string | null;
  displayName: string | null;
  setAuth: (token: string, displayName: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  displayName: null,
  setAuth: (token, displayName) => set({ token, displayName }),
  clear: () => set({ token: null, displayName: null }),
}));
