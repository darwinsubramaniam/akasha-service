import { Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import appConfig from "./app.config";

export class AppService{
    constructor(@Inject(appConfig.KEY) private readonly config: ConfigType< typeof appConfig> ) {

    }
    get cookieSecret() {
        return this.config.cookieSecret;
    }
}