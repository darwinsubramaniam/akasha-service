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
import { Registeration } from '../web3Auth/web3Auth.symbols';
import { Web3RegisterStrategy } from '../web3Auth/web3Register.strategy';
import { RegisterLoginUserDTO } from './createUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller(`user`)
@ApiTags(`user`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(Web3AuthGuard)
  @Registeration()
  @Post(`Register`)
  @ApiResponse({ status: 200, description: `New wallet registered as wallet` })
  @ApiBody({
    type: RegisterLoginUserDTO,
    description: `New wallet to be created as an user`,
  })
  async create(@Body() user: RegisterLoginUserDTO): Promise<Partial<User>> {
    return await this.userService.create(user);
  }

  @Post(`Login`)
  @ApiResponse({ status: 200, description: `Wallet logged in as wallet` })
  async login(@Body() user: RegisterLoginUserDTO, @Res({passthrough:true}) response:Response, @Req() request:Request): Promise<Partial<User>> {
    request.wallet = user.wallet;
    response.cookie(`signedData`, user.wallet);
    return await this.userService.login(user);
  }

  @Delete(`:wallet`)
  async delete(@Param(`wallet`) wallet:string): Promise<DeleteResult> {
    return this.userService.delete(wallet);
  }
}
