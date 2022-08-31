import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FiatConversion } from './fiat/conversion.entity'
import { Fiat } from './fiat/fiat.entity'
import { FiatService } from './fiat/fiat.service'
import { FixerApiService } from './fiat/fixer-api.service'

@Module({
  imports: [TypeOrmModule.forFeature([FiatConversion, Fiat]), HttpModule],
  providers: [FiatService,FixerApiService],
  exports: [FiatService],
})
export class ConversionModule {}
