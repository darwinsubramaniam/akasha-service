import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  firstValueFrom,
} from 'rxjs';

@Injectable()
export class CoingeckoService {
  public readonly PLATFORM_NAME = `CoinGecko`;
  constructor(private httpService: HttpService) {}

  /**
   * Get the list of all assets
   */
  public async fetchCryptoInfo() {
    const response = await firstValueFrom(this.httpService
      .get<CoinGeckoCryptoBasic[]>(
        `https://api.coingecko.com/api/v3/coins/list`,
      ));
    const listOfAssets = response.data;
    return listOfAssets.map((asset) => {
      const result: CoinGeckoCryptoBasic = {
        ...asset,
        platform: this.PLATFORM_NAME,
      };
      return result;
    });
  }

  /**
   * Get the imagee url for the given symbol
   * @param id coingecko id
   * @returns image urls
   */
  public async fetchCryptoImage(id: string) {
    let response = await firstValueFrom(
      this.httpService.get<CoinGeckCoinImageInfo>(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=true&sparkline=false`,
      ),
    );
    return response.data;
  }
}

export interface CoinGeckoCryptoBasic {
  platform?: string;
  id: string;
  name: string;
  symbol: string;
}

export interface CoinGeckCoinImageInfo {
  image: {
    small: string;
    thumb: string;
    large: string;
  };
}
