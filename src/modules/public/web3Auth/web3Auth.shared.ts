import { ethers } from "ethers";

export const isSignedByWallet = (wallet: string, data: string, signature: string) => {
    const recoveredAddress = ethers.utils.verifyMessage(data, signature);
    return recoveredAddress === wallet;
}