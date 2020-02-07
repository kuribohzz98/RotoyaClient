export const API_CONFIG = {
    PROTOCOL: 'http',
    HOST: 'd5acc5c6.ngrok.io',
    // PORT: '3000'
};

export const URL_API = `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}${API_CONFIG.PORT ? ':' + API_CONFIG.PORT : ''}/api/rotoya`;