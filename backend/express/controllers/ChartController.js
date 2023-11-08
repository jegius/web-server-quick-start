import {inject} from '../di.js';
import {SERVICES} from '../services/api.js';
import {CHARTS} from '../services/DataService.js';

export function createChartController(app) {
    const dataService = inject(SERVICES.DataService);

    /**
     * @swagger
     * /api/charts/bitcoin:
     *   get:
     *     summary: Fetch Bitcoin market charts data
     *     responses:
     *       200:
     *         description: Returns Bitcoin market charts data
     */
    app.get('/api/charts/bitcoin', (req, res) => {
        try {
            res.json(dataService.getData(CHARTS.bitcoinMarketChart));
        } catch (err) {
            res.status(500).json({error: err.toString()});
        }
    });

    /**
     * @swagger
     * /api/charts/market-cap-rank:
     *   get:
     *     summary: Fetch market cap rank data
     *     responses:
     *       200:
     *         description: Returns market cap rank data
     */
    app.get('/api/charts/market-cap-rank', (req, res) => {
        try {
            res.json(dataService.getData(CHARTS.dayPriceChangePercent));
        } catch (err) {
            res.status(500).json({error: err.toString()});
        }
    });

    /**
     * @swagger
     * /api/charts/markets:
     *   get:
     *     summary: Fetch market data
     *     responses:
     *       200:
     *         description: Returns market data
     */
    app.get('/api/charts/markets', (req, res) => {
        try {
            res.json(dataService.getData(CHARTS.marketCapUsd));
        } catch (err) {
            res.status(500).json({error: err.toString()});
        }
    });

}