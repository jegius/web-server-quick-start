export function ChartDataService() {
    const CHART_DATA = new Map();
    const observers = {};

    function setChartData(key, data) {
        CHART_DATA.set(key, data);

        if (observers[key]) {
            observers[key].forEach(callback => callback(data));
        }
    }

    function hasChartKey(key) {
        return CHART_DATA.has(key);
    }

    function subscribe(key, callback) {
        if (!observers[key]) {
            observers[key] = [];
        }
        const isHasCallback = observers[key].some(subscription => subscription === callback);
        if (!isHasCallback) {
            callback(CHART_DATA.get(key));
        }

        observers[key].push(callback);
        return () => {
            observers[key] = observers[key].filter(subscription => subscription !== callback);
        };
    }


    return {
        setChartData,
        subscribe,
        hasChartKey
    };
}