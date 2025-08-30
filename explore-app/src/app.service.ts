import { LoggingService } from '@explore/common/libs/logging';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly loggingService: LoggingService) {}
  getHello(): any {
    this.loggingService.log('Hello World from AppService');
    return { message: 'Hello World!' };
  }
}
  