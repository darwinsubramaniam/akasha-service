import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';

@Module({
    providers: [CoingeckoService],
    imports: [HttpModule],
    exports: [CoingeckoService],
})
export class CryptoApiModule {}