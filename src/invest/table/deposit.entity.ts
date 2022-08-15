import { IsDate, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deposit{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @IsString()
    currency: string;

    @Column()
    @IsNumber()
    amount: number;

    @Column()
    @IsDate()
    date: Date;
    
}