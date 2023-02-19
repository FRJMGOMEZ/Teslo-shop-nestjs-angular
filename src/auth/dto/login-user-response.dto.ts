import { ApiProperty } from '@nestjs/swagger';

export class LoginUserReponseDto{

   @ApiProperty()
   token:string

   @ApiProperty()
   id: string;

   @ApiProperty()
   email: string;

}