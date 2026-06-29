import React from "react";
import type { Preview } from "@storybook/react";
import { MantineProvider } from "@mantine/core";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/mocks/handlers";
import "@mantine/core/styles.css";

// Storybook 上で MSW を有効化（API 依存コンポーネントもモックで描画できる）
initialize();

const preview: Preview = {
  // 全ストーリーを MantineProvider で包む（Mantine コンポーネントの描画に必要）
  decorators: [
    (Story) => (
      <MantineProvider defaultColorScheme="light">
        <Story />
      </MantineProvider>
    ),
  ],
  parameters: {
    msw: { handlers },
  },
  loaders: [mswLoader],
};

export default preview;
