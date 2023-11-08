import {inject} from '../di.js';
import {SERVICES} from '../services/api.js';

export function createConfigController(app) {
    const config = inject(SERVICES.ConfigService);

    /**
     * @swagger
     * /api/config:
     *   get:
     *     summary: Fetch configuration
     *     responses:
     *       200:
     *         description: Returns configuration
     */
    app.get('/api/config', (req, res) => {
        try {
            res.json(config().chartsConfig);
        } catch (err) {
            res.status(500).json({error: err.toString()});
        }
    });
}