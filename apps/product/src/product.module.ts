import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Product } from './entities/product.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from 'apps/auth/src/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required()
      })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [Product],
          synchronize: true,
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Product]),
    ClientsModule.registerAsync([{
      imports: [ConfigModule],
      name: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        return {
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST') || 'auth-service2',
            port: configService.get<number>('AUTH_PORT') || 3006,
          }
        }
      },
      inject: [ConfigService]
    }])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
