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
import { Login, Registeration as Registration } from '../web3Auth/web3Auth.symbols';
import { RegisterLoginUserDTO } from './registerUser.dto';
import { User } from '../../entities/public/user.entity';
import { UserService } from './user.service';
import { IUser } from './user.interface';

@Controller(`user`)
@ApiTags(`user`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Registration()
  @Post(`register`)
  @ApiResponse({ status: 200, description: `New wallet registered as wallet` })
  @ApiBody({
    type: RegisterLoginUserDTO,
    description: `New wallet to be created as an user`,
  })
  async register(@Body() user: RegisterLoginUserDTO): Promise<Partial<User>> {
    if(!isSignedByWallet(user.wallet, user.message, user.signature)){
      throw new HttpException(`Invalid signature`, HttpStatus.NON_AUTHORITATIVE_INFORMATION);
    }
    return await this.userService.create(user);
  }

  @Post(`login`)
  @Login()
  @ApiResponse({ status: 200, description: `Wallet logged in as wallet` })
  async login(@Body() user: RegisterLoginUserDTO, @Res({passthrough:true}) response:Response, @Req() request:Request): Promise<Partial<User>> {
    if(!isSignedByWallet(user.wallet, user.message, user.signature)){
      throw new HttpException(`Invalid signature`, HttpStatus.BAD_REQUEST);
    }
    if(!await this.userService.get(user.wallet)){
      throw new HttpException(`Wallet not registered`, HttpStatus.NOT_FOUND);
    }
    const cookieData: IUser = {
      signature: user.signature,
      walletAddress: user.wallet,
      type: user.type,
      message: user.message,
    }

    response.cookie('jwt', cookieData, {signed:true , expires: new Date(Date.now() + 900000)});
    return user;
  }

  @Delete(`:wallet`)
  async delete(@Param(`wallet`) wallet:string): Promise<boolean> {
    const deleteResult = await this.userService.delete(wallet);
    return deleteResult.affected > 0 ?  true: false;
  }
}
