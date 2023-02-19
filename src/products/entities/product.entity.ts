import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {


    @ApiProperty({
        example:'1e958893-7dc4-49ed-8116-8d4d2fe85ce1',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty(
        {
            example: 'T-shirt',
            uniqueItems: true
        }
    )
    @Column('text',{unique:true})
    title:string;
    
    @ApiProperty(
        {
            example: '20',
        }
    )
    @Column('float',{default:0})
    price:number;

    @ApiProperty(
        {
            example: 'The Kids Scribble T Logo Onesie is made from 100% Peruvian cotton and features a Tesla T sketched logo for every little artist to wear.',
        }
    )
    @Column({type:'text',nullable:true})
    description:string;

    @ApiProperty({
        example:'t_shirt',
        description: 'for SEO',
    })
    @Column('text',{unique:true})
    slug:string;

    @ApiProperty({
        example: '534'
    })
    @Column('int',{default:0})
    stock:number;

    @ApiProperty({
        example: ['M','S']
    })
    @Column('text',{array:true})
    sizes:string[];

    @ApiProperty({
        example: ['men', 'woman', 'kid', 'unisex']
    })
    @Column('text')
    gender:string;

    @ApiProperty({
        example:['shirt','cotton']
    })
    @Column('text', { array: true, default:[] })
    tags:string[];

    /**
     * Se configura la elminación en cascada, y la eager relationship (cada que que busquemos un producto, nos devuleve el objeto completo de cada imagen)
     */
    @ApiProperty({
        example:'8529387-00-A_0_2000.jpg'
    })
    @OneToMany(()=>ProductImage,
                  (productImage)=>productImage.product,
                  {cascade:true,eager:true})
    images?:ProductImage[];

    @ManyToOne(
        ()=> User,
        user => user.product,
        { eager: true })
    user:User;

    @BeforeUpdate()
    checkSlugFormat(){
         if(this.slug){
             this.slug = this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
         }
    }

    @BeforeInsert()
    checkSlugInsertion(){
        if(!this.slug){
            this.slug = this.title;
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
