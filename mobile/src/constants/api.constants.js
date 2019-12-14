export const API_CONFIG = {
    PROTOCOL: 'http',
    HOST: 'dae22142.ngrok.io',
    // PORT: '3000'
};
// http://dae22142.ngrok.io

export const URL_API = `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}${API_CONFIG.PORT ? ':' + API_CONFIG.PORT : ''}`;