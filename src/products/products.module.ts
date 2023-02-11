import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ConfigService } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ConfigService],
  imports:[TypeOrmModule.forFeature([Product,ProductImage]), CommonModule, AuthModule],
  exports:[ProductsService]
})
export class ProductsModule {}
