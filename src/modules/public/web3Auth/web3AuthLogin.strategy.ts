import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Web3AuthService } from './web3Auth.service'
import { User } from '../user/user.entity';
import { IWeb3Auth } from './web3Auth.interface';

@Injectable()
export class Web3LoginStrategy extends PassportStrategy(Strategy) {
  constructor(private web3AuthService: Web3AuthService) {
    super();
  }

  async validate(awaitAuthData:IWeb3Auth): Promise<User> {
    const user = await this.web3AuthService.validateUser(awaitAuthData);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}