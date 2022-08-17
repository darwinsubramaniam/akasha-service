import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class DepositDTO {
    @IsString()
    @ApiProperty()
    currency: string;
    
    @IsNumber()
    @ApiProperty()
    amount: number;

    @Type(() => Date)
    @IsDate()
    @ApiProperty()
    date: Date;
}

export class WithdrawDTO {
    @IsString()
    @ApiProperty()
    currency: string;
    
    @IsNumber()
    @ApiProperty()
    amount: number;

    @Type(() => Date)
    @IsDate()
    @ApiProperty()
    date: Date;
}