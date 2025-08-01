import { Module } from '@nestjs/common';
import { AuthGService } from './auth-g.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [],  
  providers: [
    {
      provide: JwtAuthGuard,
      useFactory: (client: ClientProxy) => new JwtAuthGuard(client),
      inject: ['AUTH_SERVICE'],
    }
  ],
  exports: [JwtAuthGuard],
})
export class AuthGModule {}
