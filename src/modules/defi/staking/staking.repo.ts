import { Inject } from "@nestjs/common";
import { CONNECTION } from "../../../tenancy/tenancy.symbols";
import { DataSource, DeleteResult, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { Staking } from "../../../entities/private/staking/staking.entity";
import { StakingDTO } from "./staking.dto";

export class StakingRepository {

    private repo:Repository<Staking>;
    constructor(@Inject(CONNECTION) datasource:DataSource) {
        this.repo = datasource.getRepository(Staking);
    }

    async create(staking:StakingDTO):Promise<Staking> {
        return await this.repo.save(staking);
    }

    async update(uuid:string, staking:StakingDTO):Promise<UpdateResult> {
        const findOptionWhere:FindOptionsWhere<Staking> = {
            id: uuid
        }
        return await this.repo.update(findOptionWhere, staking);
    }

    async delete(uuid:string):Promise<DeleteResult> {
        const findOptionWhere:FindOptionsWhere<Staking> = {
            id: uuid
        }
        return await this.repo.delete(findOptionWhere);
    }

    async get(uuid:string):Promise<Staking> {
        const findOption:FindOneOptions<Staking> = {
           where:{
                id: uuid
           }
        }
        return await this.repo.findOne(findOption);
    }

    async getAll():Promise<Staking[]> {
        return await this.repo.find();
    }

    async getStakingForAsset(assetID:string):Promise<Staking[]> {
        const findOption:FindOneOptions<Staking> = {
            where:{
                 assetID: assetID
            }
         }
         return await this.repo.find(findOption);
    }
}