import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    limit?:number;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    offset?:number;
}