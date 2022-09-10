import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../app_base.entity';
import { Unstaking } from './unstaking.entity';


@Entity()
export class Staking extends BaseEntity {
    @Column()
    assetID: string;
    @Column()
    amount: number;
    @Column({ nullable: true })
    @OneToMany(() => Unstaking, unstaking => unstaking.id)
    unstakeRecords?: Unstaking[];
}