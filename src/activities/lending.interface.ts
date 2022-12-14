import { IAsset } from 'src/modules/public/asset/asset.interface'
import { DefiActivity } from './defiactivity.interface'

export interface Lending extends DefiActivity {
  asset: IAsset
  amount: number
  apy: number
  startDate: Date
  endDate?: Date
}
