import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer} from './helpers'
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService, private configService:ConfigService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{fileFilter,
                                           storage:diskStorage({destination:'./static/uploads',
                                                                filename:fileNamer})}))
  uploadProductFile(@UploadedFile()file:Express.Multer.File){
     if(!file){
      throw new BadRequestException('Make sure you attached a file, and the file is an image.')
     }
     const secureUrl = `${this.configService.get('hostApi')}/files/product/${file.filename}`
     return {secureUrl};
  }

  @Get('product/:imageName')
  findProductImage(@Res() res,@Param('imageName') imageName:string){
      const path = this.filesService.getStaticProductImage(imageName); 
      res.sendFile(path);
  }
}

