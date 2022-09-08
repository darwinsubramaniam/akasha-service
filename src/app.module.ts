import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestModule } from './modules/tenanted/invest/invest.module'
import { ConversionModule } from './modules/public/conversion/conversion.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DefiModule } from './modules/tenanted/defi/defi.module';
import { AssetModule } from './modules/public/asset/asset.module';
import { ScheduleModule } from '@nestjs/schedule'
import { join } from 'path'
import { UserModule } from './modules/public/user/user.module';
import { DatabaseService } from './database/database.service'
import { DatabaseModule } from './database/database.module'
import databaseConfig from './database/database.config'
import { Web3AuthModule } from './modules/public/web3Auth/web3Auth.module';
import { Web3AuthGuard } from './modules/public/web3Auth/web3Auth.guard';
require(`dotenv`).config();

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule, ConfigModule.forFeature(databaseConfig)],
      inject: [ConfigService, DatabaseService],
      useClass: DatabaseService,
    }),
    InvestModule,
    ConversionModule,
    ConfigModule.forRoot({
      envFilePath: process.env.APP_ENV === `dev` ?
        join(process.cwd(), `environment`, `dev.env`) :
        join(process.cwd(), `environment`, `prod.env`),
      isGlobal: true,
    }),
    DefiModule,
    AssetModule,
    ScheduleModule.forRoot(),
    UserModule,
    Web3AuthModule
  ],
  controllers: [],
  providers: [{
    provide: `APP_GUARD`,
    useClass: Web3AuthGuard,
  }]
})
export class AppModule {}
