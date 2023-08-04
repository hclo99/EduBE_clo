import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    await this.authService.create(
      body.name,
      body.email,
      body.password,
      body.level,
      body.matchedNum
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
