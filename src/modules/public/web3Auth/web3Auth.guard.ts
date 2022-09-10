import {
    CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isSignedByWallet } from "./web3Auth.shared";
import { IS_REGISTERATION_KEY } from "./web3Auth.symbols";

@Injectable()
export class Web3AuthGuard implements CanActivate{
  constructor(private reflector: Reflector) {
  }

  /**
   * enable the user to login with web3 
   * @param context 
   * @returns 
   */
  canActivate(context: ExecutionContext) {
    console.log(context.switchToHttp().getRequest().headers);

    if (this.isRegistrationRequest(context)) {
       return true
    }
    const wallet = context.switchToHttp().getRequest().headers.wallet;
    const signature = context.switchToHttp().getRequest().headers.signature;
    const message = context.switchToHttp().getRequest().headers.message;
    if(!wallet || !signature || !message) {
        throw new UnauthorizedException();
    }
    return isSignedByWallet(wallet, message, signature);
  }

  private isRegistrationRequest(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(
      IS_REGISTERATION_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
  }
}
