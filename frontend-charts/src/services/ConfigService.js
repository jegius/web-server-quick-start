import pkg from '../../package.json';

export function ConfigService() {
    async function getChartsConfig() {
        const data = await fetch(`${pkg.config.api_url}/api/config`);
        const json = await data.json();
        return new Map(json);
    }

    return {
        getChartsConfig
    };
}