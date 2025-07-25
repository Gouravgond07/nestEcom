import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreteUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/createUser')
  async createUser(@Body() createUser: CreteUserDto) {
    return this.authService.createUser(createUser)
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req); // Assuming local strategy populates req.user
  }
}
