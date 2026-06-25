import {
  Resolver,
  Mutation,
  Args,
  InputType,
  Field,
  ObjectType,
  Context,
} from "@nestjs/graphql";
import { firstValueFrom } from "rxjs";
import { Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";

//新規登録時のユーザ－の入力値
@InputType()
export class SignUpDto {
  @Field() displayName!: string;
  @Field() email!: string;
  @Field() password!: string;
}

//ログイン時のユーザーの入力値
@InputType()
export class LoginDto {
  @Field() email!: string;
  @Field() password!: string;
}

@ObjectType()
export class AuthResponse {
  @Field() accessToken!: string;
  @Field() email!: string;
  @Field() displayName!: string;
}

@ObjectType()
export class SignUpResponse {
  @Field()
  email!: string;

  @Field()
  message!: string;
}

//型安全のためのインターフェース定義
interface IUserService {
  login(dto: LoginDto): import("rxjs").Observable<{
    accessToken: string;
    email: string;
    displayName: string;
    password: string;
  }>;
  signUp(dto: SignUpDto): import("rxjs").Observable<any>;
}

@Resolver()
export class UserResolver implements OnModuleInit {
  private userServiceClient!: IUserService;

  constructor(@Inject("USER_PACKAGE") private client: ClientGrpc) {}

  //起動時の初期化処理
  onModuleInit() {
    this.userServiceClient =
      this.client.getService<IUserService>("UserService");
  }

  @Mutation(() => SignUpResponse)
  async signUp(@Args("dto", { type: () => SignUpDto }) dto: SignUpDto) {
    console.log("---SignUpDtoを受け取りました---");
    await firstValueFrom(this.userServiceClient.signUp(dto));
    return {
      message: "受け取りに成功しました",
    };
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args("dto", { type: () => LoginDto }) dto: LoginDto,
    @Context() context: any,
  ) {
    console.log("---ログインの受付をしました---", dto);

    const result = await firstValueFrom(this.userServiceClient.login(dto));

    const reply = context.reply;
    if (reply) {
      reply.setCookie("token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    console.log("クッキー(HttpOnly)のセットが完了しました。");
    return {
      accessToken: result.accessToken,
      email: dto.email,
      displayName: result.displayName,
    };
  }
}
