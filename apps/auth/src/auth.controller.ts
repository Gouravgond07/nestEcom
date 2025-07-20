import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CreteUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }


  @Post('/createUser')
  async createUser(@Body() createUser: CreteUserDto) {
    return this.authService.createUser(createUser)
  }

  @Post('/login')
  async login(@Body() user: LoginUserDto) {
    return this.authService.loginUser(user)
  }
}
