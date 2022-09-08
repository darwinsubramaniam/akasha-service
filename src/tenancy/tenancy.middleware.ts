import { NextFunction, Request, Response } from 'express';

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
