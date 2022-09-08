import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import { DatabaseService } from './database.service';


@Global()
@Module({
    imports: [ConfigModule.forFeature(databaseConfig)],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule{}