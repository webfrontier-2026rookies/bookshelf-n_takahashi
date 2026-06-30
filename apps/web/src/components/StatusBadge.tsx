import React from "react";

import { Badge } from "@mantine/core";

export type StatusBadgeProps = {
  /** 接続状態。true なら「接続OK」、false なら「未接続」を表示する。 */
  online: boolean;
};

// Storybook のサンプル用プレゼンテーショナルコンポーネント。
// 学習者は BookCard / ReviewItem などをこの粒度で作り、それぞれに story を書く。
export function StatusBadge({ online }: StatusBadgeProps) {
  return (
    <Badge color={online ? "teal" : "red"} variant="light">
      {online ? "接続OK" : "未接続"}
    </Badge>
  );
}
