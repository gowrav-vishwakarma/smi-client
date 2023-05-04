import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export default class VerifyUserOtpDTO {
  @IsEmail()
  username!: string;

  code!: string;
}
