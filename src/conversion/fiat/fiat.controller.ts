import { Controller, Get } from "@nestjs/common";
import { FiatService } from "./fiat.service";

@Controller('fiat')
export class FiatController {
    constructor(private readonly fiatServices:FiatService) {}

    @Get('all')
    async getAll() {
        return await this.fiatServices.get_fiat_symbols();
    }
}