import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IWeb3Auth } from './web3Auth.interface';
import { isSignedByWallet } from './web3Auth.shared';

@Injectable()
export class Web3RegisterStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(awaitAuthData:IWeb3Auth): Promise<void> {
    const { wallet, data } = awaitAuthData;
    const { address } = wallet;
    const { signed, raw } = data;
    if (!isSignedByWallet(address, raw, signed)) {
      throw new UnauthorizedException();
    }
  }
}