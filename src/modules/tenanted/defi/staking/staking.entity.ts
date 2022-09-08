import { Entity } from 'typeorm';
import { BaseEntity } from '../../../../app_base.entity';


@Entity()
export class Staking extends BaseEntity {
    asset: number;
    amount: number;
    startDate: Date;
    cooldownPeriod: number;
    endDate?: Date;
}