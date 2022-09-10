import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../app_base.entity';


@Entity()
export class Unstaking extends BaseEntity {
    @Column()
    assetID: string;
    @Column()
    amount: number;
}