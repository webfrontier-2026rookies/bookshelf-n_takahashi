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
  // BFFからのログインへのgRPCリクエストを一番手前で受け取る窓口
  @GrpcMethod("UserService", "Login")
  async login(dto: any) {
    console.log("---Login を受信しました---", dto);
    return await this.loginQueryHandler.execute(dto);
  }

  //BFFからの新規登録へのgRPCリクエストを一番手前で受け取る窓口
  @GrpcMethod("UserService", "SignUp")
  async signUp(dto: any) {
    console.log("---SignUp を受信しました---", dto);
    return await this.createUserCommandHandler.execute(dto);
  }
}
