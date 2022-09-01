import { Entity } from 'typeorm'
import { InvestBaseEntity } from './invest.base'

/**
 * Keeping Track of all the withdrawal transactions
 * This entry will describe the conversion of crypto to cash
 * */
@Entity()
export class Withdraw extends InvestBaseEntity {
}
