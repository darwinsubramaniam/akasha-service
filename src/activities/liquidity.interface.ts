import { IAsset } from '../modules/public/asset/asset.interface'
import { DefiActivity } from './defiactivity.interface'

/**
 *  Giving Liquidity activity
 *  base and quote are assets
 *  e.g base = USDT, quote = DAI will be represented as USDT/DAI
 *  base asset / quote asset
 */
export interface Liquidity extends DefiActivity {
  asset_pair: AssetPair
  startDate: Date
  endDate?: Date
}

interface AssetPair {
  base: {
    asset: IAsset
    amount: number
  }
  quote: {
    asset: IAsset
    amount: number
  }
}
