import { SetMetadata } from '@nestjs/common';

export const IS_REGISTERATION_KEY = 'isRegisteration';
/**
 * Decorate the route with this decorator to enable the user to register with web3
 * @returns 
 */
export const Registeration = () => SetMetadata(IS_REGISTERATION_KEY, true);

export const IS_LOGIN_KEY = 'isLogin';
export const Login = () => SetMetadata(IS_LOGIN_KEY, true);