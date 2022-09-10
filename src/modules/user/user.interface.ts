export interface IUser {
    // Wallet Address
    walletAddress:string,
    // Wallet Network Type
    type:string
    // Signed Data
    signature:string,
    // Raw Data
    message:string
}