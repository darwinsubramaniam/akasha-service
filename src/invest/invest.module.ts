import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversionModule } from "src/conversion/conversion.module";
import { DepositService } from "./services/deposit.service";
import { Deposit } from "./entity/deposit.entity";
import { WithdrawService } from "./services/withdraw.service";
import { InvestService } from "./services/invest.service";
import { Withdraw } from "./entity/withdraw.entity";
import { InvestController } from "./invest.controller";
import { CalculationHelper } from "./services/calculation.helper";

@Module({
  controllers: [InvestController],
  imports: [TypeOrmModule.forFeature([Deposit, Withdraw]), ConversionModule],
  providers: [DepositService, WithdrawService, InvestService, CalculationHelper],
})
export class InvestModule {}
