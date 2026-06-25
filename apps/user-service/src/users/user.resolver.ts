// apps/user-service/src/users/user.resolver.ts
import { Resolver, Mutation, Args, Context } from "@nestjs/graphql";
import { SignUpCommandHandler } from "./commands/signup/signup.handler";
import { LoginQueryHandler } from "./commands/login/login.handler";
import { SignUpDto } from "./commands/signup/user.dto";
import { LoginDto } from "./commands/login/login.dto";
import { Response } from "express";

@Resolver()
export class UserResolver {
  constructor(
    private readonly signUpHandler: SignUpCommandHandler,
    private readonly loginHandler: LoginQueryHandler,
  ) {}

  //Playground から叩く「signUp」という名前を定義
  @Mutation(() => String)
  async signUp(@Args("dto") dto: SignUpDto) {
    return this.signUpHandler.execute(dto);
  }

  //loginという名前を定義
  @Mutation(() => String)
  async login(
    @Args("dto") dto: LoginDto,
    @Context() context: { req: any; res: Response },
  ) {
    return this.loginHandler.execute(dto, context.res);
  }
}
