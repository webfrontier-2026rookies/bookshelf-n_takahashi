import type { Meta, StoryObj } from "@storybook/react";
import { BookCard } from "./BookCard";

const meta: Meta<typeof BookCard> = {
  title: "Example/BookCard",
  component: BookCard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof BookCard>;

export const Default: Story = {
  args: {
    title: "坊っちゃん",
    author: "夏目漱石",
    isbn: "978-4101010014",
    description: "親譲りの無鉄砲で小供の時から損ばかりしている。",
  },
};

export const LongText: Story = {
  args: {
    title: "寿限無寿限無五劫の擦り切れ海砂利水魚の水行末雲来末風来末",
    author: "非常に長い名前の著者名を設定してみるテスト太郎左衛門",
    isbn: "978-0000000000",
    description:
      "この文章は非常に長い説明文のテストです。MantineのlineClamp機能が正しく動作していれば、3行目を超えたあたりで自動的に「...」という三点リーダーが表示され、カードの高さが崩れずに保たれるはずです。表示崩れがないか確認してください。",
  },
};
