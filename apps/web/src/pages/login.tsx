"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Text,
  Anchor,
} from "@mantine/core";
import Link from "next/link";
import { loginSchema, LoginFormInput } from "@/schemas/authSchema";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "urql";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//ログインをbffへ要求する
const LOGIN_MUTATION = `
  mutation Login($dto: LoginDto!) {
    login(dto: $dto) {
      accessToken
      displayName
    }
  }
`;

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth); //zustandの保存関数

  const [loginResult, login] = useMutation(LOGIN_MUTATION);

  //React Hook Form と Zod の合体
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", //入力するたびにリアルタイムでチェックする設定
  });

  //バリデーション通過後に実行される送信処理
  const onSubmit = async (formData: LoginFormInput) => {
    try {
      const result = await login({
        dto: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (result.error) {
        alert(result.error.message || "ログインに失敗しました");
        return;
      }

      if (result.data?.login) {
        const { accessToken, displayName } = result.data.login;
        setAuth(accessToken, displayName);

        alert(`おかえりなさい、${displayName}さん！`);

        // ログイン後の画面へリダイレクト
        //router.push("/dashboard");
      }
    } catch (err) {
      alert("通信エラーが発生しました");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2} style={{ fontWeight: 900 }}>
        おかえりなさい！
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        アカウントをお持ちでないですか？{" "}
        <Anchor component={Link} href="/signup" size="sm">
          新規登録はこちら
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            {/* メールアドレス入力欄 */}
            <TextInput
              label="メールアドレス"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            {/* パスワード入力欄 */}
            <PasswordInput
              label="パスワード"
              placeholder="パスワードを入力"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loginResult.fetching}
            >
              ログイン
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
