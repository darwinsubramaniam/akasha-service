import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity";
import { IWeb3Auth } from "./web3Auth.interface";
import { UserService } from "../user/user.service";
import { isSignedByWallet } from "./web3Auth.shared";

@Injectable()
export class Web3AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(awaitAuthData: IWeb3Auth): Promise<User | null> {
    const { wallet, data } = awaitAuthData;
    const { address, type } = wallet;
    const { signed, raw } = data;
    if (isSignedByWallet(address, raw, signed)) {
      return await this.userService.get(address);
    }
    return null;
  }
}
