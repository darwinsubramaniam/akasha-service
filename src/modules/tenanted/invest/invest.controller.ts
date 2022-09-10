import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DepositDTO, WithdrawDTO } from './dto';
import { Deposit } from './entity/deposit.entity';
import { Withdraw } from './entity/withdraw.entity';
import { DepositService } from './services/deposit.service';
import { InvestService } from './services/invest.service';
import { WithdrawService } from './services/withdraw.service';

@Controller(`invest`)
@ApiTags(`Invest`)
export class InvestController {
  constructor(
    private readonly investService: InvestService,
    private readonly depositService: DepositService,
    private readonly withdrawService: WithdrawService,
  ) {}

  @Post(`deposit`)
  @ApiResponse({ type: Deposit, description: `The created deposit` })
  async createDeposit(@Body() deposit: DepositDTO): Promise<Deposit> {
    return await this.depositService.create(deposit);
  }

  @Post(`withdraw`)
  @ApiResponse({ type: Withdraw, description: `The created deposit` })
  async createWithdraw(@Body() deposit: WithdrawDTO): Promise<Withdraw> {
    return await this.withdrawService.create(deposit);
  }

  @Get(`investments/:base_currency`)
  async getInvestments(@Param(`base_currency`) base_currency:string): Promise<any> {
    return await this.investService.getInvestments(base_currency);
  }
}
