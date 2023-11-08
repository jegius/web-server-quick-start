import {SandyElement} from '@';
import LineChartStyles from './LineChart.scss?inline';
import {attributes, SERVICES} from '@/services/utils';
import {lineChartTemplate} from './LineChartTemplate';
import {createLineChart} from './utils';
import {inject} from '@/di/di';

export class LineChart extends SandyElement {
    static rootClass = 'line-chart'

    chartService;
    subscription;
    apiService;

    static attributes = attributes

    constructor() {
        super(LineChartStyles, lineChartTemplate.bind(null, {rootClass: LineChart.rootClass}));
        this.chartService = inject(SERVICES.ChartDataService);
        this.apiService = inject(SERVICES.ApiService);
    }

    onAttributeChange(name, oldValue, newValue) {
        if (this.chartService.hasChartKey(newValue)) {
            this.subscription = this.chartService.subscribe(newValue, this.initData.bind(this));
        }
    }

    async initData(config){
        const data = await this.apiService.get(config.url);
        this.createChart(data);
    }

    onDisconnect() {
        this.subscription?.unsubscribe();
    }

    createChart(data) {
        const lineChartElement = this.shadowRoot.querySelector(`.${LineChart.rootClass}`);
        lineChartElement.innerHTML = '';

        createLineChart(data, lineChartElement)
            .withAnimation()
            .createXAxis()
            .createYAxis()
            .withFocus();
    }
}