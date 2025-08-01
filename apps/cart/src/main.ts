import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get('HTTP_PORT') || 3000;
  await app.listen(HTTP_PORT);
}
bootstrap();
