import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FiatService } from './fiat.service';

@Controller(`fiat`)
@ApiTags(`fiat`)
export class FiatController {
    constructor(private readonly fiatServices:FiatService) {}

    @Get(`all`)
    async getAll() {
        return await this.fiatServices.getFiats();
    }
}