import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FiatConversionService } from "src/conversion/fiat/fiat.conversion.service";
import { Repository, UpdateResult } from "typeorm";
import { Deposit } from "./table/deposit.entity";

/**
 *  Keeping Track of all the deposit transactions
 *  which for now required to be inserted into the database using the api call manually
 *  - future will enable the deposit tracking using the centralized exchange service.
 */
@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit) private readonly depositRepo: Repository<
      Deposit
    >,
    private fiatConversionService:FiatConversionService
  ) {}

  async findAll(): Promise<Deposit[]> {
    return await this.depositRepo.find();
  }

  async findOne(id: number): Promise<Deposit> {
    return await this.depositRepo.findOneBy({ id });
  }

  async create(deposit: Deposit): Promise<Deposit> {
    return await this.depositRepo.save(deposit);
  }

  async update(id: number, deposit: Deposit): Promise<UpdateResult> {
    return await this.depositRepo.update(id, deposit);
  }

  async getTotalDepositAmount(base_currency: string): Promise<number> {
    const deposits = await this.findAll();

    const convertedDepositsToBaseCurrency = deposits.map(async (deposit) => {
      if (deposit.currency === base_currency) {
        return deposit.amount;
      }
      return await this.fiatConversionService.convert(deposit.amount, deposit.currency, base_currency);
    });

    const totalDeposit =  convertedDepositsToBaseCurrency.reduce(async (acc, curr) => {
        const total = await acc;
        const current =  await curr;
        return total + current;
    })

    return totalDeposit;
  }
}
