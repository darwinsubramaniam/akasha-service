import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../../entities/public/asset.entity';
import { AssetService } from './asset.service';
import { CryptoApiModule } from './crypto_api/crypto_api.module';

@Module({
    imports:[TypeOrmModule.forFeature([Asset]), CryptoApiModule],
    providers: [AssetService],
    exports: [AssetService],
})
export class AssetModule {}
