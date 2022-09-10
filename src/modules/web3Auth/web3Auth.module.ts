import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { Web3AuthGuard } from "./web3Auth.guard";


@Module ({
    imports: [ forwardRef(() => UserModule), PassportModule],
    providers: [ Web3AuthGuard],
    exports: [ Web3AuthGuard]
})
export class Web3AuthModule{}