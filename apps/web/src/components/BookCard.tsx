import React from "react";
import { Card, Text, Badge, Button, Group, Stack } from "@mantine/core";

interface BookCardProps {
  title: string;
  author: string;
  isbn?: string; // 任意
  description?: string; // 任意
  onDetailClick?: () => void;
}

export const BookCard = ({
  title,
  author,
  isbn,
  description,
  onDetailClick,
}: BookCardProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      {/* タイトルとバッジ */}
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={700} size="lg" lineClamp={1}>
          {title}
        </Text>
        <Badge color="blue" variant="light">
          書籍
        </Badge>
      </Group>

      {/* 著者とISBN */}
      <Stack gap="xs" mb="md">
        <Text size="sm" c="dimmed" fw={500}>
          著者: {author}
        </Text>
        {isbn && (
          <Text size="xs" c="gray.6">
            ISBN: {isbn}
          </Text>
        )}
      </Stack>

      {/* 概要（長い場合に備えて3行で省略するように設定） */}
      {description && (
        <Text size="sm" mb="lg" lineClamp={3} style={{ height: "4.5em" }}>
          {description}
        </Text>
      )}

      {/* 詳細ボタン */}
      <Button color="blue" fullWidth radius="md" onClick={onDetailClick}>
        詳細を確認する
      </Button>
    </Card>
  );
};
