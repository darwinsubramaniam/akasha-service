import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { PassportModule } from '@nestjs/passport';
import { Web3AuthService } from "./web3Auth.service";
import { Web3LoginStrategy } from "./web3AuthLogin.strategy";
import { Web3RegisterStrategy } from "./web3Register.strategy";
import { Web3AuthGuard } from "./web3Auth.guard";


@Module ({
    imports: [ forwardRef(() => UserModule), PassportModule],
    providers: [Web3AuthService , Web3LoginStrategy, Web3RegisterStrategy, Web3AuthGuard],
    exports: [ Web3AuthGuard]
})
export class Web3AuthModule{}