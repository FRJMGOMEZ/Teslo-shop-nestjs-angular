import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryBuilder, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import {validate as isUUID} from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  get queryBuilder() {
    return this.productRepository.createQueryBuilder();
  }

  constructor(@InjectRepository(Product)private readonly productRepository:Repository<Product>){

  }

  async create(createProductDto: CreateProductDto) {
    try{
     const product = this.productRepository.create(createProductDto);
     await this.productRepository.save(product);
     return product;
   }catch(error){
     this.handleExceptions(error);
      }
    }

    // TODO: Paginar
  async findAll(paginationDto:PaginationDto) {
    try{
      const {limit=10,offset=0} = paginationDto;
      const products = await this.productRepository.find({take:limit,skip:offset});
      return products;
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    try{
      let product;
      if(isUUID(term)){
        product = await this.productRepository.findOneBy({ id: term });
      }else{
        product = await this.queryBuilder.where('UPPER(title) =:title or slug =:slug',{title:term.toUpperCase(),slug:term.toLowerCase()}).getOne();
      }
      if(!product){
        throw new NotFoundException(`Product with id or title: ${term} hasn't been found`);
      }
      return product;
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try{
      const product = await this.productRepository.preload({ id, ...updateProductDto });
      if(!product){
        throw new NotFoundException(`Product with id: ${id} hasn't been found`);
      };
      await this.productRepository.save(product);
      return product;
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    try{
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
    }catch(error){
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error){
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if(error.response?.statusCode === 404) throw new NotFoundException(error.response.message);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs'); 
  }

}
