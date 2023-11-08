import {SandyElement} from './index';
import {AppTemplate} from './AppTemplate';
import AppStyles from './index.scss?inline';
import {SERVICES} from './services/utils';
import {inject} from '@/di/di';

export class App extends SandyElement {
    chartDataService;
    apiService;
    configService;

    constructor() {
        super(AppStyles, AppTemplate);
        this.chartDataService = inject(SERVICES.ChartDataService);
        this.apiService = inject(SERVICES.ApiService);
        this.configService = inject(SERVICES.ConfigService);

        this.prepareData()
            .then(console.log)
            .catch(console.error);
    }

    async prepareData() {
        try {
            const config = await this.configService.getChartsConfig();
            [...config.entries()].forEach(([key, config]) => this.chartDataService.setChartData(key, config))
            this.render(...config.entries())
        } catch (error) {
            throw new Error('Problem with config initialization.')
        }
    }
}