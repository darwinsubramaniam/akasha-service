import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staking } from '../../../entities/private/staking/staking.entity';
import { StakingRepository } from './staking.repo';
import { StakingService } from './staking.service';

@Module({
    imports: [TypeOrmModule.forFeature([Staking])],
    providers: [StakingRepository, StakingService],
    exports: [StakingService],
})
export class StakingModule {}
