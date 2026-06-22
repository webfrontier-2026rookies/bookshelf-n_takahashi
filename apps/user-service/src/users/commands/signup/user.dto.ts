import { IsEmail, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsEmail({}, { message: "正しいメールアドレスの形式ではありません" })
  email!: string;

  @IsString()
  @MinLength(10, { message: "パスワードは10文字以上で入力してください" })
  password!: string;
}
