import { Injectable } from '@nestjs/common';
import { FiatService } from '../../../../modules/public/conversion/fiat/fiat.service';
import { InvestBaseEntity } from '../entity/invest.base';

@Injectable()
export class CalculationHelper {
  constructor(private fiatService: FiatService) {}

  public async calculateSum<T extends InvestBaseEntity>(
    datas: T[],
    base_currency: string,
  ): Promise<number> {
    if (datas.length === 0) {
      return 0;
    }
    const convertedDepositsToBaseCurrency = datas.map(async (deposit) => {
      if (deposit.currency === base_currency) {
        return deposit.amount;
      }
      return await this.fiatService.convert(
        deposit.amount,
        deposit.currency,
        base_currency,
      );
    });

    const totalDeposit = convertedDepositsToBaseCurrency.reduce(
      async (acc, curr) => {
        const total = await acc;
        const current = await curr;
        return total + current;
      },
    );

    return await totalDeposit;
  }
}
