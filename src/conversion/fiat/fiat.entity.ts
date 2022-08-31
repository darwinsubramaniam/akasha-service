import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../app_base.entity";

@Entity()
export class Fiat extends BaseEntity{
    @Column({unique:true})
    symbol:string
    @Column()
    name:string
}