import { LoginUserReponseDto } from './login-user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRole } from 'src/auth/enums/valid-roles.enum';

export class CreateUserResponseDto extends LoginUserReponseDto{

    @ApiProperty()
     fullName:string;

     @ApiProperty()
     isActive:boolean;

     @ApiProperty()

     roles:ValidRole[]
}