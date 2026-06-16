import { useQuery } from 'urql';
import {
  Alert,
  Badge,
  Card,
  Container,
  Group,
  List,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';

// 疎通確認用クエリ。BFF の health リゾルバを呼ぶ。
const HealthQuery = `
  query Health {
    health
  }
`;

export default function Home() {
  const [{ data, fetching, error }] = useQuery({ query: HealthQuery });

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Group gap="sm">
            <Title order={1}>BookShelf</Title>
            <Badge color="grape" variant="light">
              スターターキット
            </Badge>
          </Group>
          <Text c="dimmed" mt="xs">
            フロント → BFF(GraphQL) → 各マイクロサービス(gRPC) の疎通確認ページです。
          </Text>
        </div>

        <Card withBorder radius="md" padding="lg">
          <Title order={3} mb="sm">
            疎通ステータス
          </Title>
          {fetching && <Loader size="sm" />}
          {error && (
            <Alert color="red" title="BFF に接続できません">
              {error.message}
              <Text size="sm" mt="xs">
                BFF と各サービスが起動しているか確認してください。
              </Text>
            </Alert>
          )}
          {data?.health && (
            <Alert color="teal" title="疎通 OK">
              <Text style={{ wordBreak: 'break-all' }}>{data.health}</Text>
            </Alert>
          )}
        </Card>

        <Card withBorder radius="md" padding="lg">
          <Title order={3} mb="sm">
            次にやること（学習者向け）
          </Title>
          <List type="ordered" spacing="xs">
            <List.Item>要件定義書・開発計画書を読む</List.Item>
            <List.Item>認証スライス（サインアップ／ログイン）を端から端まで実装する</List.Item>
            <List.Item>書籍・レビュー機能を追加し、DataLoader で N+1 を解消する</List.Item>
            <List.Item>レビュー編集・削除でサーバ側の認可を実装する</List.Item>
          </List>
        </Card>
      </Stack>
    </Container>
  );
}
