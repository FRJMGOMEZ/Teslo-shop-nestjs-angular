import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {

    @ApiProperty({
        default:10
    })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    limit?:number;

    @ApiProperty({
        default: 0
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    offset?:number;
}