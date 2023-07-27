import { Controller, Body, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { AuthService } from '../service/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    await this.authService.create(
      body.name,
      body.email,
      body.password,
      body.level,
    );
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
