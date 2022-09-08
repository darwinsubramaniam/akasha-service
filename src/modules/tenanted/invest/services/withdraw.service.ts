import { Inject, Injectable } from '@nestjs/common';
import { CONNECTION } from '../../../../tenancy/tenancy.symbols';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Withdraw } from '../entity/withdraw.entity';
import { CalculationHelper } from './calculation.helper';

@Injectable()
export class WithdrawService {
  private repo:Repository<Withdraw>;
  constructor(
    @Inject(CONNECTION) private readonly depositRepo: DataSource,
    private helper:CalculationHelper
  ) {
    this.repo = this.depositRepo.getRepository(Withdraw);
  }

  public async findAll(): Promise<Withdraw[]> {
    return await this.repo.find();
  }

  public async findOne(id: number): Promise<Withdraw> {
    return await this.repo.findOneBy({ id });
  }

  public async create(deposit: Withdraw): Promise<Withdraw> {
    return await this.repo.save(deposit);
  }

  public async update(id: number, deposit: Withdraw): Promise<UpdateResult> {
    return await this.repo.update(id, deposit);
  }

  public async getTotal(base_currency: string): Promise<number> {
    const withdrawals = await this.findAll();
    const totalWithdrawal = await this.helper.calculateSum(withdrawals, base_currency);
    return totalWithdrawal;
  }
}
