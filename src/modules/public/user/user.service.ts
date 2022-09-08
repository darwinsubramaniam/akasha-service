import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../../../database/database.service';
import {
    getConnectionName,
    getTenantConnection,
} from '../../../tenancy/tenancy.utils';
import { DataSource, DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterLoginUserDTO } from './createUser.dto';

@Injectable()
export class UserService {

    constructor(
        private dataSource: DataSource,
        private readonly dbService: DatabaseService,
    ) { }

    /**
     * Create new user based of wallet address
     * @param newUser Create user DTO
     * @returns create user information
     * @throws HttpException if wallet already has a user
     */
    public async create(newUser: RegisterLoginUserDTO): Promise<Partial<User>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = new User();
            user.wallet = newUser.wallet;
            user.type = newUser.type;
            let saveResult = await queryRunner.manager.save<User>(user);
            await queryRunner.commitTransaction();
            await this.createSchema(user);
            return {
                wallet: saveResult.wallet,
                type: saveResult.type,
                createdAt: saveResult.createdAt,
                updatedAt: saveResult.updatedAt,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            switch (error.code) {
                case `23505`: throw new HttpException(`Wallet already registered`, HttpStatus.CONFLICT);
                default: throw error;
            }
        } finally {
            await queryRunner.release();
        }
    }

    login(user: RegisterLoginUserDTO): Partial<User> | PromiseLike<Partial<User>> {
        return {wallet: user.wallet, type: user.type};
      }

    private async createSchema(user: User): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const connectionName = getConnectionName(user);
            await queryRunner.manager.query(`CREATE SCHEMA ${connectionName}`);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
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
        await queryRunner.manager.query(`DROP SCHEMA ${connectionName} CASCADE`);
        const deleteResult = await queryRunner.manager.delete<User>(User, { wallet: wallet });
        await queryRunner.release();
        return deleteResult;
    }
}
