import { z } from "zod";

//ログイン時のバリデーションルール
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "正しいメールアドレスの形式で入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは10文字以上で入力してください" }),
});

//新規登録時のバリデーションルール
export const signUpSchema = z
  .object({
    displayName: z.string().min(1, { message: "表示名を入力してください" }),
    email: z
      .string()
      .min(1, { message: "メールアドレスを入力してください" })
      .email({ message: "正しいメールアドレスの形式で入力してください" }),
    password: z
      .string()
      .min(10, { message: "パスワードは10文字以上で入力してください" }),
    confirmPassword: z
      .string()
      .min(1, { message: "確認用パスワードを入力してください" }),
  })
  //1回目と2回目のパスワードが一致しているかのルール
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type LoginFormInput = z.infer<typeof loginSchema>;
export type SignUpFormInput = z.infer<typeof signUpSchema>;
