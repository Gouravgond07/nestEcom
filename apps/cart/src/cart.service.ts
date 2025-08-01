import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CurrentUserDto } from '@app/auth-g/current-user.dto';


@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { userId } });

    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async getCart(userInfo: CurrentUserDto): Promise<Cart> {
    return this.getOrCreateCart(userInfo.sub);
  }

  async addToCart(userInfo: CurrentUserDto, productId: number, quantity = 1) {
    const cart = await this.getOrCreateCart(userInfo.sub);

    let item = await this.cartItemRepo.findOne({
      where: { cartId: cart.id, productId },
    });

    if (item) {
      item.quantity += quantity;
    } else {
      item = this.cartItemRepo.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    await this.cartItemRepo.save(item);
    return this.getCart(userInfo);
  }

  async removeFromCart(userInfo: CurrentUserDto, productId: number) {
    const cart = await this.getOrCreateCart(userInfo.sub);

    const item = await this.cartItemRepo.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.cartItemRepo.remove(item);
    return this.getCart(userInfo);
  }

  async clearCart(userInfo: CurrentUserDto) {
    const cart = await this.getOrCreateCart(userInfo.sub);
    await this.cartItemRepo.delete({ cartId: cart.id });
    return this.getCart(userInfo);
  }
}
