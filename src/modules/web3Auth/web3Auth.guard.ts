import {
    CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { isSignedByWallet } from "./web3Auth.shared";
import { IS_LOGIN_KEY, IS_REGISTERATION_KEY } from "./web3Auth.symbols";

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
    if (this.isRegistrationRequest(context)) {
       return true
    }

    let wallet :string;
    let signature :string;
    let message :string;
    let type :string;

    if(this.isLoginRequest(context)){
      wallet = context.switchToHttp().getRequest<Request>().body.wallet;
      signature = context.switchToHttp().getRequest<Request>().body.signature;
      message = context.switchToHttp().getRequest<Request>().body.message;
      type = context.switchToHttp().getRequest<Request>().body.type;
    }else{
      wallet = context.switchToHttp().getRequest<Request>().wallet;
      signature = context.switchToHttp().getRequest<Request>().signature;
      message = context.switchToHttp().getRequest<Request>().message;
      type = context.switchToHttp().getRequest<Request>().type;
    }
    if(!wallet || !signature || !message || !type) {
        throw new UnauthorizedException();
    }
    return isSignedByWallet(wallet, message, signature);
  }

  private isLoginRequest(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(
      IS_LOGIN_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
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
