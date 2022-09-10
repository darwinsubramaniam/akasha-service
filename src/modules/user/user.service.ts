import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  getConnectionName,
  getTenantConnection,
} from '../../tenancy/tenancy.utils';
import { DataSource, DeleteResult, FindOneOptions, Table } from 'typeorm';
import { User } from '../../entities/public/user.entity';
import { RegisterLoginUserDTO } from './registerUser.dto';

@Injectable()
export class UserService {
  private log: Logger = new Logger(UserService.name);
  constructor(
    private dataSource: DataSource,
    private readonly dbService: DatabaseService
  ) {}

  /**
   * Create new user based of wallet address
   * @param newUser Create user DTO
   * @returns create user information
   * @throws HttpException if wallet already has a user
   */
  public async create(newUser: RegisterLoginUserDTO): Promise<Partial<User>> {
    const queryRunner = this.dataSource.createQueryRunner();
    let userDbDatasource: DataSource;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new User();
      user.wallet = newUser.wallet;
      user.type = newUser.type;
      let saveResult = await queryRunner.manager.save<User>(user);
      await queryRunner.commitTransaction();
      await this.createSchema(user);
      await this.createTablesInSchema(user);
      return {
        wallet: saveResult.wallet,
        type: saveResult.type,
        createdAt: saveResult.createdAt,
        updatedAt: saveResult.updatedAt,
      };
    } catch (error) {
      this.log.error(error);
      await queryRunner.rollbackTransaction();
      switch (error.code) {
        case `23505`:
          throw new HttpException(
            `Wallet already registered`,
            HttpStatus.CONFLICT
          );
        default:
          throw error;
      }
    } finally {
      await queryRunner.release();
      if (userDbDatasource && userDbDatasource.isInitialized) {
        await userDbDatasource.destroy();
      }
    }
  }

  /** Create New Table in the schema  */
  private async createTablesInSchema(user: User) {
    const dbSource = await getTenantConnection(
      user.wallet,
      this.dbService,
      this
    );
    if (!dbSource) {
      throw new HttpException(
        `Unknown error`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    await dbSource.synchronize(true);
    if (!dbSource.isInitialized) {
      await dbSource.initialize();
    }
    await dbSource.runMigrations();
    await dbSource.destroy();
  }

  private async createSchema(user: User): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(`Creating schema`);
      const connectionName = getConnectionName(user);
      await queryRunner.manager.query(`CREATE SCHEMA ${connectionName}`);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      console.log(`createSchema finally`);
      await queryRunner.release();
    }
  }

  /**
   * Get registered user by wallet address , if not found return null
   * @param wallet wallet address
   * @returns user information or null
   */
  public async get(wallet: string): Promise<User | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const findOneOption: FindOneOptions = {
      where: { wallet: wallet },
    };
    const user = await queryRunner.manager.findOne<User>(User, findOneOption);
    await queryRunner.release();
    return user;
  }

  public async delete(wallet: string): Promise<DeleteResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const user = await this.get(wallet);
    if (!user) {
      throw new HttpException(`Wallet not registered`, HttpStatus.NOT_FOUND);
    }
    const connectionName = getConnectionName(user);
    const schemaDeleteResult = await queryRunner.manager.query(
      `DROP SCHEMA IF EXISTS ${connectionName} CASCADE`
    );
    console.log(schemaDeleteResult);
    const deleteResult = await queryRunner.manager.delete<User>(User, {
      wallet: wallet,
    });
    await queryRunner.release();
    return deleteResult;
  }
}
