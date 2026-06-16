import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ClsModule.forRoot({ global: true, middleware: { mount: false } }),
    PrismaModule,
    HealthModule,
    // TODO(学習者): commands / queries モジュール（RegisterBook, PostReview, ListBooks など）を追加する
  ],
})
export class AppModule {}
