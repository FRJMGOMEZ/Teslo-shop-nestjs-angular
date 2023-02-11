import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor( @InjectRepository(User) private readonly userRepository:Repository<User>,private readonly jwtService:JwtService ){}

  async createUser(createUserDto:CreateUserDto){
    try {
      const {password, ...userData} = createUserDto;
       const user = this.userRepository.create({...userData, password:bcrypt.hashSync(password,10)});
       await this.userRepository.save(user);
       delete user.password;
      return { ...user, token: this.getJwtToken({ email: user.email,id: user.id }) };
    }catch(error){
        this.handleDbErrors(error);
    }
  }

  async loginUser(loginUserDto:LoginUserDto){
   const {password, email} = loginUserDto;
   const user = await this.userRepository.findOne({where:{email},select:{email:true,password:true,id:true}});
   if(!user){
    throw new UnauthorizedException('Credentials are not valid.');
   }
   if(!bcrypt.compareSync(password,user.password)){
     throw new UnauthorizedException('Credentials are not valid.');
   }
   delete user.password;
    //// TODO: return JSON web token
   return {...user,token:this.getJwtToken({email:user.email,id:user.id})};
  }

  private handleDbErrors(error:any) : never {
     if(error.code === '23505'){
      throw new BadRequestException(error.detail);
     }else{
      throw new InternalServerErrorException('Please Check Server logs');
     }
  }

  private getJwtToken(payload:JwtPayload){
   const token = this.jwtService.sign(payload);
   return token;
  }
}
