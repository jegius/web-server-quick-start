import pkg from '../../package.json';

export function ApiService() {
    function get(url) {
        return fetch(`${pkg.config.api_url}/${url}`).then(data => data.json())
    }

    return {
        get
    };
}