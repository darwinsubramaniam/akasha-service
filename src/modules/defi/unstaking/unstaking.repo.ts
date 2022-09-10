import { Inject, Injectable } from "@nestjs/common";
import { Unstaking } from "../../../entities/private/staking/unstaking.entity";
import { DataSource, DeleteResult, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { CONNECTION } from "../../../tenancy/tenancy.symbols";
import { UnstakingDTO } from "./unstaking.dto";

@Injectable()
export class UnstakingRepository {
    protected repo:Repository<Unstaking>;
    constructor(@Inject(CONNECTION) datasource:DataSource){
        this.repo = datasource.getRepository(Unstaking);
    }

    async create(unstaking:UnstakingDTO):Promise<Unstaking> {
        return await this.repo.save(unstaking);
    }

    async update(uuid:string, unstaking:UnstakingDTO):Promise<UpdateResult> {
        const findOptionWhere:FindOptionsWhere<Unstaking> = {
            id: uuid
        }
        return await this.repo.update(findOptionWhere, unstaking);
    }

    async delete(uuid:string):Promise<DeleteResult> {
        const findOptionWhere:FindOptionsWhere<Unstaking> = {
            id: uuid
        }
        return await this.repo.delete(findOptionWhere);
    }

    async get(uuid:string):Promise<Unstaking> {
        const findOption:FindOneOptions<Unstaking> = {
           where:{
                id: uuid
           }
        }
        return await this.repo.findOne(findOption);
    }

    async getAll():Promise<Unstaking[]> {
        return await this.repo.find();
    }
}