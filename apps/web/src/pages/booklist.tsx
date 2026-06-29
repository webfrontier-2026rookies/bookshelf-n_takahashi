"use client";

import React from "react";
import { useQuery } from "urql";
import {
  SimpleGrid,
  Container,
  Title,
  Loader,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { BookCard } from "../components/BookCard";
import { useRouter } from "next/navigation";

//BFFへ本の一覧をちょうだいと頼むGraphQLクエリを定義
const ListBooksQuery = `
  query ListBooks {
    listBooks {
      id
      title
      author
    }
  }
`;

export default function BookList() {
  const router = useRouter();

  //URQLのuseQueryを使って、実際にBFFと通信する
  const [result] = useQuery({ query: ListBooksQuery });
  const { data, fetching, error } = result;

  //データを取ってきている最中のぐるぐる表示
  if (fetching) {
    return (
      <Container mt="xl" ta="center">
        <Loader size="xl" />
        <Text mt="md" c="dimmed">
          書籍一覧を読み込み中...
        </Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>書籍管理一覧</Title>
        <Button onClick={() => router.push("/")} color="blue">
          新しい本を登録する
        </Button>
      </Group>

      {data?.listBooks.length === 0 ? (
        <Text c="dimmed" ta="center" my="xl">
          登録されている書籍がまだありません。右上のボタンから最初の1冊を登録してみましょう！
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {data?.listBooks.map((book: any) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              // isbnやdescriptionはオプショナルなので、データがあれば渡す形にします
              // description="バックエンドから取得した本物のデータです。"
              onDetailClick={() => router.push(`/books/${book.id}`)}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
