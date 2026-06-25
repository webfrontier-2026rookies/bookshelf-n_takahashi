import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class LoginQueryHandler {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto) {
    console.log("---データベースにユーザーが存在するか確認---");

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    //ユーザーが存在しない場合
    if (!user) {
      throw new UnauthorizedException(
        "メールアドレスまたはパスワードが正しくありません",
      );
    }

    //bcrypt を使用してハッシュ化されたパスワードを検証
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "メールアドレスまたはパスワードが正しくありません",
      );
    }

    //ユーザーID（user.id）をsubに含めてトークンを発行
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
      email: user.email,
      displayName: user.displayName,
    };
  }
}
