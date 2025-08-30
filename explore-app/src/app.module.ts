import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from '@explore/common/libs/logging';

@Module({
  imports: [LoggingModule],
  controllers: [AppController],
  providers: [AppService],
  exports:[LoggingModule]
})
export class AppModule {}
