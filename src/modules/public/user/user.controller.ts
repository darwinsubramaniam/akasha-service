import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { DeleteResult } from 'typeorm';
import { Web3AuthGuard } from '../web3Auth/web3Auth.guard';
import { isSignedByWallet } from '../web3Auth/web3Auth.shared';
import { Registeration } from '../web3Auth/web3Auth.symbols';
import { Web3RegisterStrategy } from '../web3Auth/web3Register.strategy';
import { RegisterLoginUserDTO } from './createUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller(`user`)
@ApiTags(`user`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Registeration()
  @Post(`register`)
  @ApiResponse({ status: 200, description: `New wallet registered as wallet` })
  @ApiBody({
    type: RegisterLoginUserDTO,
    description: `New wallet to be created as an user`,
  })
  async create(@Body() user: RegisterLoginUserDTO): Promise<Partial<User>> {
    if(!isSignedByWallet(user.wallet, user.rawData, user.signedData)){
      throw new HttpException(`Invalid signature`, HttpStatus.NON_AUTHORITATIVE_INFORMATION);
    }
    return await this.userService.create(user);
  }

  @Post(`Login`)
  @ApiResponse({ status: 200, description: `Wallet logged in as wallet` })
  async login(@Body() user: RegisterLoginUserDTO, @Res({passthrough:true}) response:Response, @Req() request:Request): Promise<Partial<User>> {
    if(!isSignedByWallet(user.wallet, user.rawData, user.signedData)){
      throw new HttpException(`Invalid signature`, HttpStatus.UNAUTHORIZED);
    }
    if(await this.userService.get(user.wallet)){
      throw new HttpException(`Wallet not registered`, HttpStatus.UNAUTHORIZED);
    }

    response.cookie('jwt', user.wallet, {httpOnly:true});
    return user;
  }

  @Delete(`:wallet`)
  async delete(@Param(`wallet`) wallet:string): Promise<boolean> {
    const deleteResult = await this.userService.delete(wallet);
    return deleteResult.raw > 0 ?  true: false;
  }
}
