import fetchScript from './fetchScript';

const _configs = {
    apiConfig: {
        host: 'api-maps.yandex.ru',
        version: '2.1'
    }
};

let loadPromise = void 0;

const enabledAPIParams = ['lang', 'apikey', 'coordorder', 'load', 'mode'];
const successCallbackName = '_$_api_success';
const errorCallbackName = '_$_api_error';

const defaultOptions = {
    lang: 'ru_RU',
    coordorder: 'latlong',
    load: 'package.full',
    mode: 'release',
    ns: '',
    onload: successCallbackName,
    onerror: errorCallbackName
};

function generateURL(options) {
    let params = {
        ...defaultOptions
    };
    Object.keys(options).filter(function (key) {
        return enabledAPIParams.indexOf(key) !== -1;
    }).forEach(function (key) {
        params[key] = options[key];
    });

    let queryString = Object.keys(params).map(function (key) {
        return key + '=' + params[key];
    }).join('&');

    return 'https://' + _configs.apiConfig.host + '/' + (options.version || _configs.apiConfig.version) + '/?' + queryString;
}

export function loadApi(options) {
    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = new Promise(function (resolve, reject) {
        window[successCallbackName] = function (ymaps) {
            resolve(ymaps);
            window[successCallbackName] = null;
        };
        window[errorCallbackName] = function (error) {
            reject(error);
            window[errorCallbackName] = null;
        };
        fetchScript(generateURL(options));
    });

    return loadPromise;
}