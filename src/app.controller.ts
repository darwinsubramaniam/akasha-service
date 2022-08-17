import { Controller, Get } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller()
@ApiTags('app')
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get()
  @ApiResponse({type: String, description: 'The message'})
  getHello (): string {
    return this.appService.getHello()
  }
}
