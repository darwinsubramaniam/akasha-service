
import { IAsset } from 'src/modules/asset/asset.interface'
import { DefiActivity } from './defiactivity.interface'

export interface Staking extends DefiActivity {
  asset: IAsset
  amount: number
  startDate: Date
  cooldownPeriod: number
  endDate?: Date
}
