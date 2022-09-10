import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestModule } from './modules/invest/invest.module'
import { ConversionModule } from './modules/conversion/conversion.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DefiModule } from './modules/defi/defi.module';
import { AssetModule } from './modules/asset/asset.module';
import { ScheduleModule } from '@nestjs/schedule'
import { join } from 'path'
import { UserModule } from './modules/user/user.module';
import { DatabaseService } from './database/database.service'
import { DatabaseModule } from './database/database.module'
import databaseConfig from './database/database.config'
import { Web3AuthModule } from './modules/web3Auth/web3Auth.module';
import { Web3AuthGuard } from './modules/web3Auth/web3Auth.guard';
import appConfig from './app.config';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
require(`dotenv`).config();



@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule, ConfigModule.forFeature(databaseConfig)],
      inject: [ConfigService, DatabaseService],
      useClass: DatabaseService,
    }),
    ConfigModule.forRoot({
      envFilePath: process.env.APP_ENV === `dev` ?
        join(process.cwd(), `environment`, `dev.env`) :
        join(process.cwd(), `environment`, `prod.env`),
      isGlobal: true,
      cache: true,
    }),
    ConfigModule.forFeature(appConfig),
    DefiModule,
    AssetModule,
    ScheduleModule.forRoot(),
    UserModule,
    InvestModule,
    ConversionModule,
    Web3AuthModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: Web3AuthGuard,
  }, AppService]
})
export class AppModule {}
