import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unstaking } from "../../../entities/private/staking/unstaking.entity";
import { StakingModule } from "../staking/staking.module";
import { UnstakingRepository } from "./unstaking.repo";

@Module({
    imports: [TypeOrmModule.forFeature([Unstaking]), StakingModule],
    providers: [UnstakingRepository],
})
export class UnstakingModule{}