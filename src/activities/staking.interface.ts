import { Asset } from 'src/asset.interface'
import { DefiActivity } from './defiactivity.interface'

export interface Staking extends DefiActivity {
  asset: Asset
  amount: number
  startDate: Date
  cooldownPeriod: number
  endDate?: Date
}
