import { DefiActivity } from "./defiactivity.interface";
import { Asset } from "../asset.interface";

/**
 * Borrow asset activity
 */
export interface Borrow extends DefiActivity {
    asset:Asset
    amount:number;
    interestRate:number;
    startDate:Date;
    endDate?:Date;
}