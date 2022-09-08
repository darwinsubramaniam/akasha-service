import { Entity } from 'typeorm'
import { InvestBaseEntity } from './invest.base'

/**
 * Keeping Track of all the deposit transactions
 * This entry will describe the conversion of cash to crypto
 */
@Entity()
export class Deposit extends InvestBaseEntity {
}
