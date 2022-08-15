import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversionModule } from 'src/conversion/conversion.module';
import { DepositService } from './deposit.service';
import { Deposit } from './table/deposit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Deposit]), ConversionModule],
    providers: [DepositService],
})
export class InvestModule {}
