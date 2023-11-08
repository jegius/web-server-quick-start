import { Module } from '@nestjs/common';
import { ChartsController } from './controllers/charts.controller';
import { ConfigController } from './controllers/config.controller';
import { DataService } from './services/data.service';
import { ConfigService } from './services/config.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ChartsController, ConfigController],
  providers: [ConfigService, DataService],
})
export class AppModule {}