import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '@app/auth-g';
import { CurrentUser } from '@app/auth-g/current-user.directive';
import { CurrentUserDto } from '@app/auth-g/current-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CREATE
  @Post()
  async create(@CurrentUser() userInfo: CurrentUserDto, @Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(userInfo.sub, createProductDto);
  }

  // READ ALL
  @Get()
  async findAll(): Promise<Product[]> {
    const products = this.productService.findAll();
    return products
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  async update(
    @CurrentUser() userInfo: CurrentUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto, userInfo.sub);
  }

  // DELETE
  @Delete(':id')
  async remove(@CurrentUser() userInfo: CurrentUserDto,@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id, userInfo.sub);
  }
}
