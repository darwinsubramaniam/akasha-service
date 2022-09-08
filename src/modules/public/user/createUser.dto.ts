import {ApiProperty } from '@nestjs/swagger';

export class RegisterLoginUserDTO {
  @ApiProperty({
    description: `Wallet address`,
    example:`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
  })
  wallet: string;
  @ApiProperty({
    description: `Signed data by wallet`,
    example: `0x383b801b9b59fe8686b097df1c502129356e62d4f74b84f328b29676bb0135ac46cd974bce6fedc1f90ff8d0c434975efd9f1940cbfc9a385131f7727fc77b8f1b`
  })
  signedData: string;
  @ApiProperty({
    description: `Raw data which was signed by the wallet`,
    example: `The message to be signed`
  })
  rawData: string;
  @ApiProperty({
    description: `wallet network type`,
    type: String,
    default: `ether`,
    enum: [
      `ether`,
      `substrate`,
      `solana`,
      `cardano`,
      `near`,
      `tezos`,
      `bitcoin`,
    ],
  })
  type: string;
}
