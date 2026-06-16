import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

// Storybook のサンプルストーリー。`pnpm --filter web storybook` で確認できる。
const meta: Meta<typeof StatusBadge> = {
  title: 'Example/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Online: Story = {
  args: { online: true },
};

export const Offline: Story = {
  args: { online: false },
};
