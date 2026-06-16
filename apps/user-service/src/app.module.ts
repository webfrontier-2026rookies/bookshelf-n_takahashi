import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // リクエスト単位のコンテキスト（実行ユーザー等）を伝搬させる土台。
    // 認証実装時にここへ userId を載せて commands 側で参照する。
    ClsModule.forRoot({ global: true, middleware: { mount: false } }),
    PrismaModule,
    HealthModule,
    // TODO(学習者): commands / queries モジュール（SignUp, Login など）を追加する
  ],
})
export class AppModule {}
