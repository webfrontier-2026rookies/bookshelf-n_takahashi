// apps/user-service/src/users/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req as Request;

    //フロントから返ってくる「クッキー」または「ヘッダー」からトークンを取り出す
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("認証トークンが見つかりません");
    }

    try {
      // 💡 2. 秘密鍵を使い、トークンが期限切れでないか、改ざんされてないかを検証
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "super-secret-key-change-me",
      });

      //検証が成功したら、コンテキスト（Requestオブジェクト）にユーザー情報を紐付ける
      (request as any)["user"] = { id: payload.sub };
    } catch (error) {
      // 期限切れ、または改ざんされている場合はここでエラーになる
      throw new UnauthorizedException(
        "アクセストークンが無効または期限切れです",
      );
    }

    // true を返すと、ガードを通過して実際の処理（MutationやQuery）の実行を許可します
    return true;
  }

  /**
   * クッキーまたはヘッダーからトークンを抽出するヘルパー関数 (手順1の処理)
   */
  private extractToken(request: Request): string | undefined {
    // 優先度①: クッキー（access_token）に入っているか確認
    if (request.cookies && request.cookies["access_token"]) {
      return request.cookies["access_token"];
    }

    // 優先度②: ヘッダー（Authorization: Bearer xxxxx）に入っているか確認
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
