import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestModule } from './invest/invest.module'
import { ConversionModule } from './conversion/conversion.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DefiModule } from './defi/defi.module';
import { AssetModule } from './asset/asset.module';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        logging: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
      })
    }),
    InvestModule,
    ConversionModule,
    ConfigModule.forRoot(
      {
        isGlobal: true
      }
    ),
    DefiModule,
    AssetModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
