import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreteUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/auth-g/jwt-auth.guard';

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
    return this.authService.login(req.user); // Assuming local strategy populates req.user
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @MessagePattern({ cmd: 'VALIDATE_TOKEN' })
  async microMsg(data: any) { 
    console.log('Microservice message received:', data);
    return this.authService.validateToken(data.token);
  }
}
