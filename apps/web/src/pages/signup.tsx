"use client";

import React from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
} from "@mantine/core";
import { useMutation } from "urql";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { signUpSchema, SignUpFormInput } from "@/schemas/authSchema";

const SIGN_UP_MUTATION = `
  mutation SignUp($dto: SignUpDto!) {
    signUp(dto: $dto) {
      message
    }
  }
`;

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  //urql の新規登録 mutation を準備
  const [signUpResult, signUp] = useMutation(SIGN_UP_MUTATION);

  //React Hook Form と Zod の合体
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  //バリデーションを通過した時だけ呼ばれる送信処理
  const onSubmit = async (formData: SignUpFormInput) => {
    try {
      //BFFへデータを安全に送信
      const result = await signUp({
        dto: {
          displayName: formData.displayName,
          email: formData.email,
          password: formData.password,
        },
      });

      if (result.error) {
        alert(result.error.message || "新規登録に失敗しました");
        return;
      }

      //トークンと名前をZustand（LocalStorage）に記憶
      if (result.data?.signUp) {
        const { accessToken, displayName } = result.data.signUp;
        setAuth(accessToken, displayName);

        alert("新規登録に成功しました！");
        router.push("/login");
      }
    } catch (err) {
      alert("通信エラーが発生しました");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2} style={{ fontWeight: 900 }}>
        新規アカウント登録
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            {/* 表示名 */}
            <TextInput
              label="表示名"
              placeholder="あなたの名前"
              {...register("displayName")}
              error={errors.displayName?.message}
            />

            {/* メールアドレス */}
            <TextInput
              label="メールアドレス"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            {/* パスワード */}
            <PasswordInput
              label="パスワード"
              placeholder="パスワードを入力"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* 確認用パスワード*/}
            <PasswordInput
              label="確認用パスワード"
              placeholder="パスワードを再入力"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={signUpResult.fetching}
            >
              登録する
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
