import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Deposit } from "../entity/deposit.entity";
import { CalculationHelper } from "./calculation.helper";

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
    private helper:CalculationHelper
  ) {}

  public async findAll(): Promise<Deposit[]> {
    return await this.depositRepo.find();
  }

  public async findOne(id: number): Promise<Deposit> {
    return await this.depositRepo.findOneBy({ id });
  }

  public async create(deposit: Deposit): Promise<Deposit> {
    return await this.depositRepo.save(deposit);
  }

  public async update(id: number, deposit: Deposit): Promise<UpdateResult> {
    return await this.depositRepo.update(id, deposit);
  }

  public async getTotal(base_currency: string): Promise<number> {
    const deposits = await this.findAll();
    const totalDeposit = await this.helper.calculateSum(deposits, base_currency);
    return totalDeposit;
  }
}
