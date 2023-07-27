import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  level: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
