import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { UserController } from './user.controller';
import { User } from '../../entities/public/user.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
