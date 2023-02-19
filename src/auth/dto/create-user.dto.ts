import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    
    @ApiProperty()
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty({
        description:'minLenght = 6; maxLength=50; must have an uppercase, a lowercase, a letter and a number.'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty()
    @IsString()
    fullName:string;
}
