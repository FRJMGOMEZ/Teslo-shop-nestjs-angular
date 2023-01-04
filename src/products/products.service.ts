import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import {validate as isUUID} from 'uuid';
import { ProductImage } from './entities/product-image.entity';
import { ConfigService } from '@nestjs/config';
import { QueryRunnerService } from '../common/query-runner.service';

@Injectable()
export class ProductsService {
  private defaultLimit: number;

  private readonly logger = new Logger('ProductsService');

  get queryBuilder() {
    return this.productRepository.createQueryBuilder('prod');
  }

  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>, 
              @InjectRepository(ProductImage) private readonly productImageRepository: Repository<ProductImage>,
              private readonly configService: ConfigService,
              private queryRunnerService:QueryRunnerService){
    this.defaultLimit = configService.getOrThrow<number>('defaultLimit');
  }

  async create(createProductDto: CreateProductDto) {
    try{
     const {images = [], ...productDetails} = createProductDto;
     const product = this.productRepository.create({...productDetails,images:images.map(image=> this.productImageRepository.create({url:image}))});
     await this.productRepository.save(product);
     return {...product, images:images};
   }catch(error){
     this.handleExceptions(error);
      }
    }

    // TODO: Paginar
  async findAll(paginationDto:PaginationDto) {
    try{
      const {limit=this.defaultLimit,offset=0} = paginationDto;
      const products = await this.productRepository.find({take:limit,skip:offset,relations:{images:true}});
      return products.map((product)=> ({...product,images:product.images.map((image)=>image.url)}));
    }catch(error){
      this.handleExceptions(error);
    }
  }

  async findOnePlain(term:string){
    const {images = [],...product} = await this.findOne(term);
    return {
    ...product,
      images: images.map((image) => image.url)
    }
  }

  private async findOne(term: string) {
    try{
      let product;
      if(isUUID(term)){
        product = await this.productRepository.findOneBy({ id: term });
      }else{
        product = await this.queryBuilder.where('UPPER(title) =:title or slug =:slug',{title:term.toUpperCase(),slug:term.toLowerCase()}).leftJoinAndSelect('prod.images','prodImages').getOne();
      }
      if(!product){
        throw new NotFoundException(`Product with id or title: ${term} hasn't been found`);
      }
      return product;
    }catch(error){
      this.handleExceptions(error);
    }
  }

  /// El query runner  sirve para hacer transacciones y hacer rollback si algo falla ///
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate });
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} hasn't been found`);
    };
    const queryRunner = await this.queryRunnerService.startQueryRunner();
    try{
      if(images){
        await queryRunner.manager.delete(ProductImage,{product:{id}});
        product.images = images.map((image)=>this.productImageRepository.create({url:image}));
        await queryRunner.manager.save(product);
      }else{
        product.images = await this.productImageRepository.findBy({product:{id}})
      }
      await this.queryRunnerService.commitAndReleaseQueryRunner(queryRunner);
      return {...product,images:product.images.map((img)=>img.url)};
      ;
    }catch(error){
      await this.queryRunnerService.rollbackAndReleaseQueryRunner(queryRunner)
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

  async deletAllProducts(){
    const query = this.queryBuilder;
    try{
     return await query.delete().where({}).execute();
    }catch(error){
    this.handleExceptions(error);
    }
  }

}
