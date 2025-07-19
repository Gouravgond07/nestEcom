import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @Get()
  async getHello(): Promise<User[]> {
    // return this.usersRepository.find()
    return await this.authService.getHello();
  }
}
