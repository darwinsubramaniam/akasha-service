import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DepositService } from "./deposit.service";
import { WithdrawService } from "./withdraw.service";

/**
 * Stores the services which are used between deposit and withdraw services
 */
@Injectable()
export class InvestService {
  constructor(
    @Inject(forwardRef(() => DepositService))
    private depositService: DepositService,
    @Inject(forwardRef(() => WithdrawService))
    private withdrawService: WithdrawService,
  ) {}

  async getInvestments(
    base_currency: string,
  ): Promise<{ deposits: number; withdraws: number }> {
    const deposits = await this.depositService.getTotal(base_currency);
    const withdraws = await this.withdrawService.getTotal(base_currency);
    return { deposits, withdraws };
  }

  async getProfitLoss(
    base_currency: string,
  ): Promise<{ type: ProfitLose; value: number }> {
    const investments = await this.getInvestments(base_currency);
    const profitLoss = investments.deposits - investments.withdraws;
    return {
      type: (profitLoss > 0 ? ProfitLose.Profit : ProfitLose.Loss),
      value: profitLoss,
    };
  }
}

export enum ProfitLose {
  Profit = "Profit",
  Loss = "Loss",
}
