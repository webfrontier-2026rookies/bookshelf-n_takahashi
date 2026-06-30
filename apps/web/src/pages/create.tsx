// 📄 apps/web/src/app/books/new/page.tsx
"use client";

import React, { useState } from "react";
import { Container, Title, Paper } from "@mantine/core";
import { BookCreateForm, FormValues } from "../components/BookCreateForm";

export default function BookCreatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("このデータをバックエンドに送る:", values);

      // 🚀 TODO: ここにGraphQLのMutation（データ登録のクエリ）を呼び出すコードを書く
      await createBookMutation({ variables: { input: values } });

      alert("書籍の登録に成功しました！（※通信処理はTODO）");
    } catch (error) {
      console.error(error);
      alert("登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="lg">
        新しい書籍の登録
      </Title>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <BookCreateForm
          isSubmitting={isSubmitting}
          onSubmit={handleRegisterSubmit}
        />
      </Paper>
    </Container>
  );
}
