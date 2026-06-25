import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { LoginQueryHandler } from "./query/login/login.handler";
import { SignUpCommandHandler } from "./commands/signup/signup.handler";

@Controller()
export class UsersController {
  constructor(
    private readonly loginQueryHandler: LoginQueryHandler,

    private readonly createUserCommandHandler: SignUpCommandHandler,
  ) {}

  /**
   * 🎯 BFFからの「Login」の電話（gRPC）を一番手前で受け取る窓口
   * 読み取り系なので queries フォルダの職人にバトンタッチします
   */
  @GrpcMethod("UserService", "Login")
  async login(dto: any) {
    console.log(
      "---[UsersController] gRPC経由で Login を受信しました ---",
      dto,
    );
    return await this.loginQueryHandler.execute(dto);
  }

  /**
   * 🎯 BFFからの「SignUp（新規登録）」の電話（gRPC）を一番手前で受け取る窓口
   * 書き込み系なので、本来は commands フォルダの職人にバトンタッチします
   */
  @GrpcMethod("UserService", "SignUp")
  async signUp(dto: any) {
    console.log(
      "---[UsersController] gRPC経由で SignUp を受信しました ---",
      dto,
    );
    return await this.createUserCommandHandler.execute(dto);
  }
}
