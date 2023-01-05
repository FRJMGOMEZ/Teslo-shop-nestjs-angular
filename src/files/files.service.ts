import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class FilesService {


    getStaticProductImage(imageName:string){
        const path = join(__dirname,'../../static/uploads',imageName);
        if(!existsSync(path)){
            throw new BadRequestException('No product found');
        }
        return path;
    }
 
}
