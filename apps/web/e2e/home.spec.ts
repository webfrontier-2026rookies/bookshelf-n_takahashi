import { test, expect } from '@playwright/test';

// 最小の E2E（スモークテスト）。トップページが描画されることを確認する。
// 学習者は「ログイン → 書籍登録 → レビュー投稿」のハッピーパスをここに追加する。
test('トップページに見出しが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'BookShelf' })).toBeVisible();
});

test('疎通ステータスカードが存在する', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('疎通ステータス')).toBeVisible();
});
