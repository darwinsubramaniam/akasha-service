import { DefiActivity } from './defiactivity.interface'
import { IAsset } from '../modules/asset/asset.interface'

/**
 * Borrow asset activity
 */
export interface Borrow extends DefiActivity {
  asset: IAsset
  amount: number
  interestRate: number
  startDate: Date
  endDate?: Date
}
