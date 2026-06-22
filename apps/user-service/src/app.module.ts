import { Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { JwtModule } from "@nestjs/jwt";
import { SignUpCommandHandler } from "src/users/commands/signup/signup.handler";
import { LoginQueryHandler } from "src/users/commands/login/login.handler";

@Module({
  imports: [
    // リクエスト単位のコンテキスト（実行ユーザー等）を伝搬させる土台。
    // 認証実装時にここへ userId を載せて commands 側で参照する。
    ClsModule.forRoot({ global: true, middleware: { mount: false } }),
    PrismaModule,
    HealthModule,
    // TODO(学習者): commands / queries モジュール（SignUp, Login など）を追加する
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [],
  providers: [SignUpCommandHandler, LoginQueryHandler],
})
export class AppModule {}
