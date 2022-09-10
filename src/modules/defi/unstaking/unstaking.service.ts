import { Unstaking } from "../../../entities/private/staking/unstaking.entity";
import { StakingService } from "../staking/staking.service";
import { UnstakingDTO } from "./unstaking.dto";
import { UnstakingRepository } from "./unstaking.repo";

export class UnstakingService{
    constructor(
        private repo:UnstakingRepository,
        private stakingService:StakingService) {}

    // Adding new unstaking to crypto asset
    async addUnstaking(unstaking:UnstakingDTO):Promise<Unstaking> {

        // check if  staking > unstaking
        const currentStakedRecords = await this.stakingService.getStakingForAsset(unstaking.assetID)
        const currentStakedAmount = currentStakedRecords.reduce((acc, curr) => acc + curr.amount, 0);

        if(!unstaking.endDate){
            unstaking.endDate = new Date(Date.now());
        }
        return await this.repo.create(unstaking);
    }
    // modifying unstaking

    // deleting unstaking

    // getting unstakings

    // getting all unstakings
}