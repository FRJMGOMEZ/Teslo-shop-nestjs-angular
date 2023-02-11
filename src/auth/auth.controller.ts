import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dro';
import { User } from './entities/user.entity';
import { GetRawHeaders } from '../common/decorators/get-raw-header.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRole } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);/* this.authService.create(createAuthDto); */
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user:User){
     return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@GetUser(['email']) user: User, @GetRawHeaders(['Bearer']) rawHeaders:string[]){
    return {ok:true,user, rawHeaders};
  }

  @Get('private2')
  @RoleProtected(ValidRole.admin,ValidRole.superUser)
  @UseGuards(AuthGuard(),UserRoleGuard)
  testingPrivateRoute2(@GetUser(['email']) user: User) {
    return { ok: true, user};
  }

  @Get('private3')
  @Auth(ValidRole.admin,ValidRole.superUser)
  testingPrivateRoute3(@GetUser(['email']) user: User) {
    return { ok: true, user };
  }
}
