import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Withdraw } from "../entity/withdraw.entity";
import { CalculationHelper } from "./calculation.helper";

@Injectable()
export class WithdrawService {
  constructor(
    @InjectRepository(Withdraw) private readonly depositRepo: Repository<
      Withdraw
    >,
    private helper:CalculationHelper
  ) {}

  public async findAll(): Promise<Withdraw[]> {
    return await this.depositRepo.find();
  }

  public async findOne(id: number): Promise<Withdraw> {
    return await this.depositRepo.findOneBy({ id });
  }

  public async create(deposit: Withdraw): Promise<Withdraw> {
    return await this.depositRepo.save(deposit);
  }

  public async update(id: number, deposit: Withdraw): Promise<UpdateResult> {
    return await this.depositRepo.update(id, deposit);
  }

  public async getTotal(base_currency: string): Promise<number> {
    const withdrawals = await this.findAll();
    const totalWithdrawal = await this.helper.calculateSum(withdrawals, base_currency);
    return totalWithdrawal;
  }
}
