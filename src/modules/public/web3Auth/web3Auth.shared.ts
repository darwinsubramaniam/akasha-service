import { ethers } from "ethers";

export const isSignedByWallet = (wallet: string, data: string, signature: string) => {
    try{
        const recoveredAddress = ethers.utils.verifyMessage(data, signature);
        return recoveredAddress === wallet;
    }
    catch(error){
        return false;
    }
}