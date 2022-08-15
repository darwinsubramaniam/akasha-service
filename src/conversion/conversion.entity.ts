import { IsDate, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique( ['to' , 'from'])
export class Conversion {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @IsString()
    to: string;

    @Column()
    @IsString()
    from: string;

    @Column()
    @IsNumber()
    rate: number;

    @Column()
    @IsDate()
    entry_date: Date;
}