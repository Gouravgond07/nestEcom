import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private client: ClientProxy
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('check')
  async check() {
    const t = await firstValueFrom(this.client.send({ cmd: 'MICRO_MSG' }, { msg: 'send' }))
    console.log('t', t);
    return {
      msg: 'working'
    }
  }
}
