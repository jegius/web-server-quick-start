import express from 'express';
import cors from 'cors';
import {provideService} from './di.js';
import {ConfigService} from './services/ConfigService.js';
import {DataService} from './services/DataService.js';
import {createChartController} from './controllers/ChartController.js';
import {SERVICES} from './services/api.js';
import {createConfigController} from './controllers/ConfigController.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

provideService(
    [SERVICES.ConfigService, ConfigService],
    [SERVICES.DataService, DataService]
);

await DataService().init();

createChartController(app);
createConfigController(app);

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: '1.0.0',
            title: 'Nodejs API',
            description: 'Nodejs API Information',
            contact: {
                name: 'Amazing Developer'
            },
            servers: [`http://localhost:${port}`]
        }
    },
    apis: ['./controllers/*.js']
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => console.log(`Server is running on port ${port}`));