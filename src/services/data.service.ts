import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from './config.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DataService implements OnModuleInit {
    private readonly dataUrls: Record<string, string>;
    private readonly cache = new Map<string, any>();

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.dataUrls = this.configService.get('urls');
    }

    onModuleInit() {
        this.loadData();
    }

    private async loadData() {
        for (const [key, url] of Object.entries(this.dataUrls)) {
            this.httpService.get(url)
                .pipe(
                    map(response => this.getMapper(key)(response.data)),
                    catchError(err => {
                        console.error('Problem with data mapping!', err, key);
                        return of(false);
                    })
                )
                .subscribe(data => this.cache.set(key, data));
        }
    }

    getData(key: string) {
        return this.cache.get(key);
    }

    private getMapper(key: string) {
        switch (key) {
            case 'marketCapUsd':
                return (data) => data.map(({ name, market_cap }) => ({ name, weight: market_cap }));
            case 'dayPriceChangePercent':
                return (data) => data.map(({ current_price, name }) => ({ name, weight: current_price }));
            case 'bitcoinMarketChart':
                return (data) => data.prices;
            default:
                return (data) => data;
        }
    }
}