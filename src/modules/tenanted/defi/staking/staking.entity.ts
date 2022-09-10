import { Asset } from '../../../../modules/public/asset/asset.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../app_base.entity';


@Entity()
export class Staking extends BaseEntity {
    @OneToOne(() => Asset)
    @JoinColumn()
    asset: Asset;
    amount: number;
    startDate: Date;
    cooldownPeriod: number;
    endDate?: Date;
}