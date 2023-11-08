import { ConfigService } from '../services/config.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('nest')
@Controller('api/config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    @ApiOperation({ summary: 'Get config data' })
    @ApiResponse({ status: 200, description: 'return config of chart' })
    getConfig() {
        return this.configService.get('chartsConfig');
    }
}
