import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CurrentUser } from '@app/auth-g/current-user.directive';
import { CurrentUserDto } from '@app/auth-g/current-user.dto';
import { JwtAuthGuard } from '@app/auth-g';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getCart(@CurrentUser() userInfo: CurrentUserDto) {
    return this.cartService.getCart(userInfo);
  }

  @Post('add')
  async addToCart(
    @CurrentUser() userInfo: CurrentUserDto,
    @Body() body: { productId: number; quantity?: number },
  ) {
    return this.cartService.addToCart(userInfo, body.productId, body.quantity ?? 1);
  }

  @Delete('remove/:productId')
  async removeFromCart(
    @CurrentUser() userInfo: CurrentUserDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeFromCart(userInfo, productId);
  }

  @Delete('clear')
  async clearCart(@CurrentUser() userInfo: CurrentUserDto) {
    return this.cartService.clearCart(userInfo);
  }
}
