import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONNECTION } from '../../../../tenancy/tenancy.symbols';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Deposit } from '../entity/deposit.entity';
import { CalculationHelper } from './calculation.helper';

/**
 *  Keeping Track of all the deposit transactions
 *  which for now required to be inserted into the database using the api call manually
 *  - future will enable the deposit tracking using the centralized exchange service.
 */
@Injectable()
export class DepositService {
  private repo: Repository<Deposit>;
  constructor(
    @Inject(CONNECTION) private readonly dataSource: DataSource,
    private helper:CalculationHelper
  ) {
    console.log(this.dataSource.isInitialized);
    this.repo = this.dataSource.getRepository(Deposit);
  }

  public async findAll(): Promise<Deposit[]> {
    return await this.repo.find();
  }

  public async findOne(id: number): Promise<Deposit> {
    return await this.repo.findOneBy({ id });
  }

  public async create(deposit: Deposit): Promise<Deposit> {
    return await this.repo.save(deposit);
  }

  public async update(id: number, deposit: Deposit): Promise<UpdateResult> {
    return await this.repo.update(id, deposit);
  }

  public async getTotal(base_currency: string): Promise<number> {
    const deposits = await this.findAll();
    const totalDeposit = await this.helper.calculateSum(deposits, base_currency);
    return totalDeposit;
  }
}
