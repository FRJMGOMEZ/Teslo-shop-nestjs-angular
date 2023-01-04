import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(private productsService:ProductsService) {
    
  }
  async runSeed() {
    return this.inserNewProducts();
  }

  private async inserNewProducts(){
     await this.productsService.deletAllProducts();
     const seedProducts = initialData.products;
     const insertPromises = seedProducts.map((product)=>this.productsService.create(product) );
     await Promise.all(insertPromises);
  }
}
