import { IsEmail, IsNotEmpty } from "class-validator";

export default class VerifyUserDTO {
  @IsEmail()
  username!: string;

  @IsNotEmpty()
  authtoken!: string;
}
