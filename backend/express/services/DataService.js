import {inject} from '../di.js';
import {SERVICES} from './api.js';
import fetch from 'node-fetch';

export const CHARTS = {
    marketCapUsd: 'marketCapUsd',
    dayPriceChangePercent: 'dayPriceChangePercent',
    bitcoinMarketChart: 'bitcoinMarketChart',
};


function marketCupMapper(data) {
    return data?.map(({name, market_cap}) => ({
        name,
        weight: market_cap
    }));
}

function dayPriceChangePercentMapper(data) {
    return data?.map(({current_price, name}) => ({
        name,
        weight: current_price
    }));
}

function bitcoinMarketChart(data) {
    return data.prices;
}

const MAPPER = new Map([
    [CHARTS.marketCapUsd, marketCupMapper],
    [CHARTS.dayPriceChangePercent, dayPriceChangePercentMapper],
    [CHARTS.bitcoinMarketChart, bitcoinMarketChart],
]);

const CACHE = new Map();

export function DataService() {
    const configService = inject(SERVICES.ConfigService);

    async function init({urls}) {
        const keys = Object.keys(urls);
        const data = await Promise.all(Object.values(urls).map(url => fetch(url)));
        const response = await Promise.all(data.map(response => response.json()));


        keys.forEach((key, index) => {
            try {
                CACHE.set(key, MAPPER.get(key)(response[index]));
            } catch (error) {
                console.error('Problem with data mapping!: ', error, key, response[index])
            }
        });
    }

    return {
        getData: (key) => CACHE.get(key),
        init: () => init(configService())
    };
}