import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class LoginWithTokenDTO {
  @IsEmail()
  username!: string;

  @IsString()
  @IsNotEmpty()
  token!: string;
}
