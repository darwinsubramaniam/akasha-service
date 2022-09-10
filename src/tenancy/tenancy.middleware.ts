import { NextFunction, Request, Response } from 'express';

/**
 * This will varify the wallet cookies if it is present in the request
 * if there is no valid cookies present in the request then it will
 * throw an error - unless it specified that 
 * @param req
 * @param _res
 * @param next
 */
export function AuthorizedWalletMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const resetWeb3Auth = () => {
    req.wallet = ""
    req.signature = ""
    req.message = ""
    req.type = ""
  }
  resetWeb3Auth();
  if(req.signedCookies.jwt){
    req.wallet = req.signedCookies.jwt.walletAddress
    req.signature = req.signedCookies.jwt.signature
    req.message = req.signedCookies.jwt.message
    req.type = req.signedCookies.jwt.type
  }
  next();
}
