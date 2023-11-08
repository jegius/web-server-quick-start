import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import {provideService} from './di.js';
import {SERVICES} from './services/api.js';
import {DataService} from './services/DataService.js';
import {ConfigService} from './services/ConfigService.js';
import {ChartController} from './controllers/ChartController.js';
import {ConfigController} from './controllers/ConfigController.js';
import {koaSwagger} from 'koa2-swagger-ui';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Koa Swagger CHART API',
            version: '1.0.0',
        },
    },
    apis: ['./**/*.js'],
};

const port = process.env.PORT || 3000;
const app = new Koa();
const router = new Router();
const swaggerSpec = swaggerJSDoc(options);


app.use(cors());
provideService(
    [SERVICES.ConfigService, ConfigService],
    [SERVICES.DataService, DataService]
);

router.get('/swagger.json', async (ctx) => {
    ctx.body = swaggerSpec;
});

router.get(
    '/swagger',
    koaSwagger({
        routePrefix: false, // disable the default route
        swaggerOptions: {
            spec: swaggerSpec, // use the swagger spec generated above
        },
    })
);

await DataService().init();

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.toString() };
    }
});

ChartController(router);
ConfigController(router)

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(port, () => console.log(`Server is running on port ${port}`));