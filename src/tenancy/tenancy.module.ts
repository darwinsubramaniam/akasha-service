import {
  FactoryProvider,
  Global,
  HttpException,
  HttpStatus,
  Module,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { UserModule } from '../modules/public/user/user.module';
import { UserService } from '../modules/public/user/user.service';
import { DataSource } from 'typeorm';
import { Web3AuthMiddleware } from './tenancy.middleware';
import { CONNECTION } from './tenancy.symbols';
import { getTenantConnection } from './tenancy.utils';

const connectionFactory: FactoryProvider<DataSource> = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (
    request: Request,
    dbService: DatabaseService,
    userService: UserService
  ) => {
    if(!request.wallet){
      throw new HttpException(`Wallet not registered`, HttpStatus.UNAUTHORIZED);
    }
    return await getTenantConnection(request.wallet, dbService, userService);
  },
  inject: [REQUEST, DatabaseService, UserService],
};

@Global()
@Module({
  imports: [DatabaseModule, UserModule],
  providers: [connectionFactory, Web3AuthMiddleware],
  exports: [CONNECTION],
})
export class TenancyModule {}
