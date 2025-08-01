import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreteUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/auth-g/jwt-auth.guard';
import { CurrentUser } from '@app/auth-g/current-user.directive';
import { CurrentUserDto } from '@app/auth-g/current-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/createUser')
  async createUser(@Body() createUser: CreteUserDto) {
    return this.authService.createUser(createUser)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('Login request received:', req.user);
    return this.authService.login(req.user); // Assuming local strategy populates req.user
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() currentUser: CurrentUserDto) {
    return currentUser;
  }

  @MessagePattern({ cmd: 'VALIDATE_TOKEN' })
  async microMsg(data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
