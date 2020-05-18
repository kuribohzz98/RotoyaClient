const API_CONFIG = {
    PROTOCOL: 'http',
    HOST: 'dbf189d3.ngrok.io',
    // PORT: '3000'
};

const URL_API = `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}${API_CONFIG.PORT ? ':' + API_CONFIG.PORT : ''}/api/rotoya`;

const optionsBaseAxios = {
    baseURL: URL_API,
    timeout: 5000
}

export default {
    URL_API,
    optionsBaseAxios
}