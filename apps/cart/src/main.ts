import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get('HTTP_PORT') || 3000;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {        
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'nestjs-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(HTTP_PORT);
}
bootstrap();
