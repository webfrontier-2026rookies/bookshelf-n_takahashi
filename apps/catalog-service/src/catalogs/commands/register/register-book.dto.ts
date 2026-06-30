import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";

export class RegisterBookDto {
  @IsString()
  @IsNotEmpty({ message: "タイトルは必須です" })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: "著者は必須です" })
  author!: string;
}
