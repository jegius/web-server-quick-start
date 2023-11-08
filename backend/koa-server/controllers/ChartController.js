import {inject} from '../di.js';
import {SERVICES} from '../services/api.js';
import {CHARTS} from '../services/DataService.js';

export function ChartController(router) {
    const dataService = inject(SERVICES.DataService);

    /**
     * @swagger
     * /api/charts/bitcoin:
     *   get:
     *     summary: Fetch Bitcoin market charts data
     *     responses:
     *       200:
     *         description: Returns Bitcoin market charts data
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: array
     *                 items:
     *                   oneOf:
     *                     - type: string
     *                     - type: number
     *               example:
     *                - - "PAN0"
     *                  - 34573.50053343686
     *                - - 1698868809338
     *                  - 34514.2530416425
     *                - - 1698872462328
     *                  - 35112.29258839147
     */
    router.get('/api/charts/bitcoin', (ctx) => {
        ctx.body = dataService.getData(CHARTS.bitcoinMarketChart);
    });

    /**
     * @swagger
     * /api/charts/market-cap-rank:
     *   get:
     *     summary: Fetch market cap rank
     *     responses:
     *       200:
     *         description: Successful Operation
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                   weight:
     *                     type: number
     *             example:
     *               - name: "Aave ETH v1"
     *                 weight: 1895.91
     *               - name: "Tether"
     *                 weight: 0.99962
     *               - name: "Bitcoin"
     *                 weight: 35396
     */
    router.get('/api/charts/market-cap-rank', (ctx) => {
        ctx.body = dataService.getData(CHARTS.dayPriceChangePercent);
    });

    /**
     * @swagger
     * /api/charts/markets:
     *   get:
     *     summary: Fetch market data
     *     responses:
     *       200:
     *         description: Successful Operation
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                   weight:
     *                     type: number
     *             example:
     *               - name: "Aave ETH v1"
     *                 weight: 1895.91
     *               - name: "Tether"
     *                 weight: 0.99962
     *               - name: "Bitcoin"
     *                 weight: 35396
     */
    router.get('/api/charts/markets', (ctx) => {
        ctx.body = dataService.getData(CHARTS.marketCapUsd);
    });

}