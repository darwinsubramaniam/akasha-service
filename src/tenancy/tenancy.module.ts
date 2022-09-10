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
import { UserModule } from '../modules/user/user.module';
import { UserService } from '../modules/user/user.service';
import { DataSource } from 'typeorm';
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
    return await getTenantConnection(request.signedCookies.jwt, dbService, userService);
  },
  inject: [REQUEST, DatabaseService, UserService],
};

@Global()
@Module({
  imports: [DatabaseModule, UserModule],
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class TenancyModule {}
