import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity{
    @ApiProperty()
    @PrimaryGeneratedColumn(`uuid`)
    id: string;

    @ApiProperty({type: Date})
    @CreateDateColumn({
        type: `timestamp with time zone`,
        name: `created_at`,
    })
    createdAt: Date;

    @ApiProperty({type: Date})
    @UpdateDateColumn({
        type: `timestamp with time zone`,
        name: `updated_at`,
    })
    updatedAt: Date;
}