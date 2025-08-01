import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get('HTTP_PORT') || 3000;
  await app.listen(HTTP_PORT);
}
bootstrap();
