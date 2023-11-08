import {inject} from '../di.js';
import {SERVICES} from '../services/api.js';

export function ConfigController(router) {
    const config = inject(SERVICES.ConfigService);
    /**
     * @swagger
     * /api/config:
     *   get:
     *     summary: Fetch config
     *     responses:
     *       200:
     *         description: Successful Operation
     *         content:
     *           application/json:
     *             example:
     *               urls:
     *                 marketCapUsd: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
     *                 dayPriceChangePercent: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=7&page=1"
     *                 bitcoinMarketChart: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
     *               chartsConfig:
     *                - - marketCapUsd
     *                  - url: "api/charts/markets"
     *                    type: "Pie"
     *                - - dayPriceChangePercent
     *                  - url: "api/charts/market-cap-rank"
     *                    type: "Pie"
     *                - - bitcoinMarketChart
     *                  - url: "api/charts/bitcoin"
     *                    type: "Line"
     */
    router.get('/api/config', (ctx) => {
        ctx.body = config().chartsConfig;
    });
}