import { Controller, Get } from '@nestjs/common';
import { DataService } from '../services/data.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('nest')
@Controller('api/charts')
export class ChartsController {
    constructor(private readonly dataService: DataService) {}

    @Get('bitcoin')
    @ApiOperation({ summary: 'Get Bitcoin data' })
    @ApiResponse({ status: 200, description: 'The Bitcoin data' })
    getBitcoin() {
        return this.dataService.getData('bitcoinMarketChart');
    }

    @Get('market-cap-rank')
    @ApiOperation({ summary: 'Get Market Cap Rank data' })
    @ApiResponse({ status: 200, description: 'The Market Cap Rank data' })
    getMarketCapRank() {
        return this.dataService.getData('dayPriceChangePercent');
    }

    @Get('markets')
    @ApiOperation({ summary: 'Get Markets data' })
    @ApiResponse({ status: 200, description: 'The Markets data' })
    getMarkets() {
        return this.dataService.getData('marketCapUsd');
    }
}