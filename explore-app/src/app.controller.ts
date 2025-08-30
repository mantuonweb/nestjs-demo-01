import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingService } from '@explore/common/libs/logging';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly loggingService: LoggingService) {}

  @Get()
  getHello(): any {
    this.loggingService.log('Hello World');
    return this.appService.getHello();
  }
}
