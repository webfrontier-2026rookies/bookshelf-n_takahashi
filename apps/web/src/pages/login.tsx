import { useState } from "react";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation Login($dto: LoginDto!) {
              login(dto: $dto) {
                accessToken
                email
                displayName
              }
            }
          `,
          variables: {
            dto: {
              email,
              password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        alert(`ログイン失敗: ${result.errors[0].message}`);
      } else {
        const { displayName } = result.data.login;

        alert(`ようこそ、${displayName}さん`);

        //マイページなどへリダイレクト
      }
    } catch (error) {
      console.error("通信エラー:", error);
      alert("サーバーとの通信に失敗しました。");
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="メールアドレス"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              label="パスワード"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth mt="xl" loading={loading}>
              ログイン
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
