import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { QueryRunnerService } from '../common/query-runner.service';

@Injectable()
export class SeedService {

  constructor(private productsService:ProductsService,@InjectRepository(User) readonly userRepository:Repository<User>) {
    
  }
  async runSeed() {
    await this.deleteTables();
    const firstUser = await this.insertUsers();
    await this.inserNewProducts(firstUser);
    return 'SEED EXCECUTED';
  }

  private async inserNewProducts(firstUser:User){
     await this.productsService.deleteAllProducts();
     const seedProducts = initialData.products;
     const insertPromises = seedProducts.map((product)=>this.productsService.create(product, firstUser) );
     await Promise.all(insertPromises);
  }

  private async insertUsers(){
     const seedUsers = initialData.users;
     const users:User[] = [];
     seedUsers.forEach((user)=>{
          users.push(this.userRepository.create(user));
     });
     const dbUsers = await this.userRepository.save(seedUsers);
     return dbUsers[0];
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    queryBuilder.delete()
                .where({})
                .execute();
  }
}
