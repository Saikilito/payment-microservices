import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDTO {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
