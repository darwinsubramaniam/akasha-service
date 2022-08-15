import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversion } from "./conversion.entity";
import { FiatConversionService } from "./fiat/fiat.conversion.service";

@Module({
  imports: [TypeOrmModule.forFeature([Conversion]), HttpModule],
  providers: [FiatConversionService]
})
export class ConversionModule {}
