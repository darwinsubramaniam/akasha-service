import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import databaseConfig from './database.config';
import { SnakeNamingStrategy } from './snake-naming.strategy';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY) private readonly config: ConfigType<
      typeof databaseConfig
    >,
  ) {}

    public createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return this.default();
    }

    public default(): TypeOrmModuleOptions {
        return {
            type: `postgres`,
            host: this.config.host,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            logging: this.config.logging,
            schema: this.config.schema,
            synchronize: this.config.synchronize,
            namingStrategy: new SnakeNamingStrategy(),
            entities: [join(__dirname, `../entities/public/**/*.entity{.ts,.js}`)],
            migrations: [join(__dirname,  `../migrations/public/*{.ts,.js}`)],
        };
    }

    public tenantTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            ...this.default(),
            autoLoadEntities: true,
            entities: [join(__dirname, `../entities/private/**/*.entity{.ts,.js}`)],
            migrations: [join(__dirname, `../migrations/private/*{.ts,.js}`)],
        };
    }


}
