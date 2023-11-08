import {attributes, CHART_MAPPING} from './services/utils';

export function AppTemplate(...args) {
    return `
        <div class="root">
           <div class="charts">
                ${args?.reduce((result, [key, {type}]) => `${result}
                    <div class="chart-item">
                        <${CHART_MAPPING[type]} ${attributes.CHART_KEY}="${key}"> 
                    </div>`, '')}
           </div>
        </div>`;
}