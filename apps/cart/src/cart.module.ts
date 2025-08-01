import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

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
          entities: [CartItem, Cart],
          synchronize: true,
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([CartItem, Cart]),
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
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
