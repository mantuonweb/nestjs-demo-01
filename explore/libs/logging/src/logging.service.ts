import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  log(message: string) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error);
  }

  warn(message: string) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }

  debug(message: string) {
    console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
  }

  info(message: string) {
    console.info(`[INFO] ${new Date().toISOString()}: ${message}`);
  }
}
