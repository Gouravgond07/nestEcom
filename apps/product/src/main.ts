import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const configService = app.get(ConfigService);
  // app.connectMicroservice<MicroserviceOptions>({
  //     transport: Transport.TCP,
  //     options: {
  //       host: '0.0.0.0',
  //       port: 3001,
  //     },
  //   });
  const HTTP_PORT = configService.get('HTTP_PORT') || 3000;
  // await app.startAllMicroservices();
  await app.listen(HTTP_PORT);
}
bootstrap();
