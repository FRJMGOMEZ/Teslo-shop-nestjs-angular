import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';

@Entity({name:'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{unique:true})
    title:string;

    @Column('float',{default:0})
    price:number;

    @Column({type:'text',nullable:true})
    description:string;

    @Column('text',{unique:true})
    slug:string;

    @Column('int',{default:0})
    stock:number;

    @Column('text',{array:true})
    sizes:string[];

    @Column('text')
    gender:string;

    @Column('text', { array: true, default:[] })
    tags:string[];

    /**
     * Se configura la elminación en cascada, y la eager relationship (cada que que busquemos un producto, nos devuleve el objeto completo de cada imagen)
     */
    @OneToMany(()=>ProductImage,
                  (productImage)=>productImage.product,
                  {cascade:true,eager:true})
    images?:ProductImage[];

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
