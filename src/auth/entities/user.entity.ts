import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ValidRole } from '../enums/valid-roles.enum';

@Entity('users')
export class User {

    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty()
    @Column('text',{unique:true})
    email:string;

    @ApiProperty()
    @Column('text',{select:false})
    password:string;

    @ApiProperty()
    @Column('text')
    fullName:string;

    @ApiProperty()
    @Column('bool',{default:true})
    isActive:boolean;

    @ApiProperty()
    @Column('text',{array:true,default:['user']})
    roles:ValidRole[];

    @ApiProperty()
    @OneToMany(
        ()=> Product,
        (product) => product.user
    )
    product:Product[]

    @BeforeInsert()
    checkFieldsBeforeInsert(){
    this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
     
}

