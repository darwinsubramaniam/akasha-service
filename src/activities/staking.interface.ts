
import { IAsset } from 'src/asset/asset.interface'
import { DefiActivity } from './defiactivity.interface'

export interface Staking extends DefiActivity {
  asset: IAsset
  amount: number
  startDate: Date
  cooldownPeriod: number
  endDate?: Date
}
