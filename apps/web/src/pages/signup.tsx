import React from "react";
import "@mantine/hooks";
import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
} from "@mantine/core";

export default function signup() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ローディング開始

    try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation SignUp($dto: SignUpDto!) {
              signUp(dto: $dto) {
                message
              }
            }
          `,
          variables: {
            dto: {
              displayName,
              email,
              password: password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        alert(`登録失敗: ${result.errors[0].message}`);
      } else {
        alert("新規登録が成功しました！");
      }
    } catch (error) {
      console.error("通信エラー:", error);
    } finally {
      setLoading(false); // ローディング解除
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2} style={{ fontWeight: 900 }}>
        新規アカウント登録
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="表示名"
              placeholder="あなたの名前"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />

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
              登録する
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
