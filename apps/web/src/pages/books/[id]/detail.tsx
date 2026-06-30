// 📄 apps/web/src/app/books/[id]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Card,
  Badge,
  Group,
  Button,
  Stack,
} from "@mantine/core";

export default function BookDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const mockBook = {
    id: id,
    title: "TypeScript超入門 (詳細データ)",
    author: "山田太郎",
    isbn: 1234567890123,
    description:
      "今日エラーを乗り越えて開通させた、記念すべきバックエンド連携システムによって取得された（想定の）書籍詳細データです。",
  };

  return (
    <Container size="sm" py="xl">
      <Card withBorder shadow="md" p="xl" radius="md">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Badge color="blue" mb="xs">
                書籍ID: {mockBook.id}
              </Badge>
              <Title order={1}>{mockBook.title}</Title>
            </div>
          </Group>

          <Text size="lg" c="dimmed">
            タイトル: {mockBook.title}
          </Text>

          <Text size="lg" c="dimmed">
            著者: {mockBook.author}
          </Text>

          <Text size="sm" c="gray">
            <strong>ISBN:</strong> {mockBook.isbn}
          </Text>

          <Card withBorder p="md" bg="gray.0" radius="sm">
            <Text size="sm" style={{ whiteSpace: "pre-line" }}>
              {mockBook.description}
            </Text>
          </Card>

          <Button
            variant="light"
            color="gray"
            onClick={() => window.history.back()}
          >
            一覧に戻る
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
