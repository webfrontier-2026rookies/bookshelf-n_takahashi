import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "メールアドレスの形式が正しくありません" })
  @IsNotEmpty({ message: "メールアドレスは必須です" })
  email!: string;

  @IsNotEmpty({ message: "パスワードは必須です" })
  @MinLength(6, { message: "パスワードは6文字以上です" })
  password!: string;
}
