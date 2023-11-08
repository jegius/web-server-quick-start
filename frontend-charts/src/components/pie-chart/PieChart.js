import {SandyElement} from '@';
import PieChartStyles from './PieChart.scss?inline';
import {pieChartTemplate} from './PieChartTemplate';
import {attributes, SERVICES} from '@/services/utils';
import {createPieChart} from './utils';
import {inject} from '@/di/di';

export class PieChart extends SandyElement {
    static rootClass = 'pie-chart'

    chartService;
    subscription;
    apiService;

    static attributes = attributes

    constructor() {
        super(PieChartStyles, pieChartTemplate.bind(null, {rootClass: PieChart.rootClass}));
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
        const pieChartElement = this.shadowRoot.querySelector(`.${PieChart.rootClass}`);
        pieChartElement.innerHTML = '';

        createPieChart(data, pieChartElement)
            .withTooltip()
            .withHoverActions()
            .withSelectAction();
    }
}