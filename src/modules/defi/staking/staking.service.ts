import { DeleteResult, UpdateResult } from "typeorm";
import { Staking } from "../../../entities/private/staking/staking.entity";
import { StakingDTO, } from "./staking.dto";
import { StakingRepository } from "./staking.repo";

export class StakingService{
    constructor(
        private readonly stakingRepository: StakingRepository,
    ) {}

    // Adding new staking to crypto asset
    async addStaking(staking:StakingDTO):Promise<Staking> {
        return await this.stakingRepository.create(staking);
    }

    // modifying staking
    async updateStaking(uuid:string, staking:StakingDTO):Promise<UpdateResult> {
        return this.stakingRepository.update(uuid, staking);
    }

    // deleting staking
    async deleteStaking(uuid:string):Promise<DeleteResult> {
        return this.stakingRepository.delete(uuid);
    }
    async getStakingForAsset(assetId:string):Promise<Staking[]> {
        return await this.stakingRepository.getStakingForAsset(assetId);
    }
}