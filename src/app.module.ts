import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestModule } from './invest/invest.module'
import { ConversionModule } from './conversion/conversion.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      // On Synchronize is true, the database is synchronized with the model each time the server is started.
      // ALERT!! DISABLE THIS FOR PRODUCTION
      synchronize: true,
      autoLoadEntities: true,

    }),
    InvestModule,
    ConversionModule,
    ConfigModule.forRoot(
      {
        isGlobal: true
      }
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
