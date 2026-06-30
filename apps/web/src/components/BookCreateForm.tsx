// 📄 apps/web/src/components/BookCreateForm.tsx
import React from "react";
import { TextInput, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

//フォームが扱うデータの型を定義
export type FormValues = {
  title: string;
  author: string;
  isbn: number;
  description: string;
};

type BookCreateFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: FormValues) => void;
};

export const BookCreateForm = ({
  isSubmitting,
  onSubmit,
}: BookCreateFormProps) => {
  const form = useForm<FormValues>({
    initialValues: { title: "", author: "", isbn: 0, description: "" },
    validate: {
      title: (value: string) =>
        value.trim().length === 0 ? "タイトルを入力してください" : null,
      author: (value: string) =>
        value.trim().length === 0 ? "著者名を入力してください" : null,
      isbn: (value) =>
        String(value).length !== 13 ? "13桁の数値を入力してください" : null,
      description: (value: string) =>
        value.trim().length === 0 ? "概要を入力してください" : null,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values: FormValues) => onSubmit(values))}>
      <Stack>
        <TextInput
          label="書籍のタイトル"
          required
          {...form.getInputProps("title")}
        />
        <TextInput label="著者名" required {...form.getInputProps("author")} />
        <TextInput label="ISBN" {...form.getInputProps("isbn")} />
        <TextInput label="概要" {...form.getInputProps("description")} />
        <Button loading={isSubmitting} type="submit">
          書籍を登録する
        </Button>
      </Stack>
    </form>
  );
};
