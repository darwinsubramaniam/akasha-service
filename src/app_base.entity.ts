import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity{
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({type: Date})
    @CreateDateColumn()
    createdAt: Date;
    
    @ApiProperty({type: Date})
    @UpdateDateColumn()
    updatedAt: Date;
}