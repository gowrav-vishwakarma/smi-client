import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export default class LoginDTO {
  @IsEmail()
  username!: string;

  @IsNotEmpty()
  password!: string;
}
