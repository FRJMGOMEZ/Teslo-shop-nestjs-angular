import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {

    @ApiProperty({
        description:'Product title (unique)',
        nullable: true
    })
    @IsString()
    @MinLength(1)
    title:string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?:string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number;

    @ApiProperty({
        example:['M','XL']
    })
    @IsString({each:true})
    @IsArray()
    sizes:string[];

    @ApiProperty()
    @IsIn(['men','woman','kid','unisex'])
    gender:string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags:string[];

    @ApiProperty({
        example:['some_image.png'],
        description:'Url`s given by post file request'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
