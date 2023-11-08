import {registry} from './registry/regestry';
import {App} from './App';
import {PieChart} from './components/pie-chart/PieChart';
import {SERVICES} from './services/utils';
import {ChartDataService} from './services/ChartDataService';
import {ApiService} from './services/ApiService';
import {ConfigService} from './services/ConfigService';
import {LineChart} from './components/line-chart/LineChart';

registry()
    .resetCss()
    .register(App, PieChart, LineChart)
    .provideService(
        [SERVICES.ChartDataService, ChartDataService],
        [SERVICES.ApiService, ApiService],
        [SERVICES.ConfigService, ConfigService],
    )
    .init()
    .mount('#app', App);
