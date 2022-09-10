import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FiatConversion } from '../../entities/public/conversion.entity'
import { FiatController } from './fiat/fiat.controller'
import { Fiat } from '../../entities/public/fiat.entity'
import { FiatService } from './fiat/fiat.service'
import { FixerApiService } from './fiat/fixer-api.service'

@Module({
  controllers: [FiatController],
  imports: [TypeOrmModule.forFeature([FiatConversion, Fiat]), HttpModule],
  providers: [FiatService,FixerApiService],
  exports: [FiatService],
})
export class ConversionModule {}
