import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staking } from './staking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Staking])],
})
export class StakingModule {}
