import { Controller, Body, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createuser.dto';
import { AuthService } from '../service/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.authService.create(body.name, body.email, body.password, body.level);
  }
}
