// src/users/commands/signup/signup.handler.ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignUpDto } from "./user.dto";
import { ulid } from "ulid";
import * as bcrypt from "bcrypt";

@Injectable()
export class SignUpCommandHandler {
  constructor(private prisma: PrismaService) {}

  async execute(dto: SignUpDto) {
    // 1. 重複チェック
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException("このメールアドレスは既に登録されています");
    }

    // 2. ULID生成 ＆ 3. パスワードハッシュ化
    const userId = ulid(); //26文字のULID
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4. データベースへの登録
    return await this.prisma.user.create({
      data: {
        id: userId,
        email: dto.email,
        passwordHash: hashedPassword,
        displayName: dto.email.split("@")[0],
      },
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });
  }
}
