import {
  Resolver,
  Mutation,
  Args,
  InputType,
  Field,
  ObjectType,
} from "@nestjs/graphql";
@InputType()
export class SignUpDto {
  @Field()
  displayName!: string;

  @Field()
  email!: string;

  @Field()
  passwordHash!: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async signUp(@Args("dto", { type: () => SignUpDto }) dto: SignUpDto) {
    console.log("--- 🎉 BFFの窓口が正式な SignUpDto を受け取りました！ ---");
    console.log("データ中身:", dto);

    return "BFFで型を認識し、受け取りに成功しました！";
  }
}

@InputType()
export class LoginDto {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

//ログイン成功時に画面に返すデータの形（会員証トークンとユーザー情報）
@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field()
  email!: string;
}
