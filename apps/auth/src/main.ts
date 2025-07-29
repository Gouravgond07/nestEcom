import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AuthModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     host: '0.0.0.0',
  //     port: 4000
  //   }    
  // })

  // await app.listen()
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const HTTP_PORT = configService.get('HTTP_PORT') || 3000;
  await app.startAllMicroservices();
  await app.listen(HTTP_PORT);
}
bootstrap();
