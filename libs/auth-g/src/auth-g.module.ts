import { Module } from '@nestjs/common';
import { AuthGService } from './auth-g.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'AUTH_SERVICE',
      transport: Transport.TCP, 
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    }])
  ],  
  providers: [
    // AuthGService, 
    {
      provide: JwtAuthGuard,
      useFactory: (client: ClientProxy) => new JwtAuthGuard(client),
      inject: ['AUTH_SERVICE'],
    },
  ],
  exports: [JwtAuthGuard],
})
export class AuthGModule {}
