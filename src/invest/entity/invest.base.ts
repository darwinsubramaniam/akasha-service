import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Allow, IsDate, IsNumber, IsString } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

/**
 * The base class for the investment transactions type
 * 1. Deposit - The conversion of cash to crypto
 * 2. Withdraw - The conversion of crypto to cash
 */
export abstract class InvestBaseEntity {
  @PrimaryGeneratedColumn()
  @Allow()
  @ApiProperty()
  id?: number;

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
  @ApiProperty()
  date: Date;
}
