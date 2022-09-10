import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { BaseEntity } from '../../../app_base.entity';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * The base class for the investment transactions type
 * 1. Deposit - The conversion of cash to crypto
 * 2. Withdraw - The conversion of crypto to cash
 */
export abstract class InvestBaseEntity extends BaseEntity {
  @Column()
  @IsString()
  @ApiProperty()
  currency: string;

  @Column()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @Column()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: `The date the transaction was created`,
  })
  date: Date;
}
