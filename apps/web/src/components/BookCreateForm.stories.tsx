// 📄 apps/web/src/components/BookCreateForm.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { BookCreateForm } from "./BookCreateForm";
import type { FormValues } from "./BookCreateForm";

const meta: Meta<typeof BookCreateForm> = {
  title: "Components/BookCreateForm",
  component: BookCreateForm,
};

export default meta;
type Story = StoryObj<typeof BookCreateForm>;

export const Empty: Story = {};

export const Default: Story = {
  args: {
    isSubmitting: false,
    onSubmit: (data: FormValues) =>
      console.log("送信ボタンが押されました！", data),
  },
};

//送信中（ぐるぐるが回っている）状態のテスト
export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
