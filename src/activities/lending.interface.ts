import { Asset } from "src/asset.interface";
import { DefiActivity } from "./defiactivity.interface";

export interface Lending extends DefiActivity {
    asset: Asset,
    amount: number,
    apy: number,
    startDate: Date,
    endDate?: Date
}