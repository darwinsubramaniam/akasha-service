import { Inject, Injectable } from '@nestjs/common';
import { CONNECTION } from '../../../tenancy/tenancy.symbols';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Withdraw } from '../../../entities/private/invest/withdraw.entity';
import { CalculationHelper } from './calculation.helper';
import { WithdrawDTO } from '../dto';

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

  public async findOne(id: string): Promise<Withdraw> {
    return await this.repo.findOneBy({ id });
  }

  public async create(withdraw: WithdrawDTO): Promise<Withdraw> {
    return await this.repo.save(withdraw);
  }

  public async update(id: string, deposit: WithdrawDTO): Promise<UpdateResult> {
    return await this.repo.update(id, deposit);
  }

  public async getTotal(base_currency: string): Promise<number> {
    const withdrawals = await this.findAll();
    const totalWithdrawal = await this.helper.calculateSum(withdrawals, base_currency);
    return totalWithdrawal;
  }
}
