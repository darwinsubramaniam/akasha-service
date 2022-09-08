import { SetMetadata } from '@nestjs/common';

export const IS_REGISTERATION_KEY = 'isRegisteration';
export const Registeration = () => SetMetadata(IS_REGISTERATION_KEY, true);