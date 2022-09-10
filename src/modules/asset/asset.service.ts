import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoingeckoService } from './crypto_api/coingecko.service';
import { Asset } from '../../entities/public/asset.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(Asset) private repo:Repository<Asset>,
        private readonly coinGeckoService:CoingeckoService) {}

    public async getAssetBySymbol(symbol: string): Promise<Asset> {
        return this.repo.findOne({where: {symbol}});
    }

    public async getAssetList(page: number, pageSize: number): Promise<Asset[]> {
        return this.repo.find({
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    public async totalCount(): Promise<number> {
        return this.repo.count();
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
    public async fetchCryptoAssets(): Promise<void> {
       const listOfAssets = await this.coinGeckoService.fetchCryptoInfo();
       const lisOfAssetInDatabase = await this.repo.find();
       listOfAssets.forEach(onlineAsset => {
            const isFound = lisOfAssetInDatabase.find(asset => asset.symbol === onlineAsset.symbol);
            if (!isFound) {
                const asset = new Asset();
                asset.platform_name = onlineAsset.platform;
                asset.symbol = onlineAsset.symbol;
                asset.name = onlineAsset.name;
                asset.platform_id = onlineAsset.id;
                this.repo.insert(asset);
            }
       });
    }

}