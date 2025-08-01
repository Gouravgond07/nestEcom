import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  // CREATE
  async create(userId: number, createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({ ...createProductDto, userId });
    return this.productRepository.save(product);
  }

  // READ ALL
  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // READ ONE
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  // UPDATE
  async update(id: number, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {
    // await this.findOne(id); // throws if not found
    const product = await this.productRepository.findOneBy({ id, userId });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found for user`);
    }
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id); // return updated
  }

  // DELETE
  async remove(id: number, userId: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id, userId });
    if(!product) {
      throw new NotFoundException(`Product with id ${id} not found for user`);
    }
    await this.productRepository.delete(id);
  }
}
