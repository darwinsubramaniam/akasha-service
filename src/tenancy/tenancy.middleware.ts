import { Inject, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../modules/public/user/user.service';


@Injectable()
export class Web3AuthMiddleware {

   constructor(@Inject(UserService) private readonly userService: UserService) {}

   use(req: Request, res: Response, next: NextFunction) {
        next();
    }
}
/**
 * This will varify the wallet cookies if it is present in the request
 * 
 * @param req
 * @param _res
 * @param next
 */
export function AuthorizedWalletMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next();
}
