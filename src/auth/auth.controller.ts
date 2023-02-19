import { Controller, Get, Post, Body,UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { GetRawHeaders } from '../common/decorators/get-raw-header.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRole } from './enums/valid-roles.enum';
import { Auth } from './decorators/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserReponseDto } from './dto/login-user-response.dto';
import { CreateUserResponseDto } from './dto/create-user-response-dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User has been succesfully created', type: CreateUserResponseDto })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.authService.createUser(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'Succesfully logged', type:LoginUserReponseDto})
  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto): Promise<LoginUserReponseDto>{
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
