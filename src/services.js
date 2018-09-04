/*
Здесь должны быть собраны обращения к внешним ресурсам.
В данном случае — к Yandex.Maps
 */

const YMAPS_URL = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=map,Placemark,geolocation&onload=ymapscb';

export function loadYMaps() {
    return new Promise((resolve, reject) => {
        if (global.ymaps) {
            resolve(global.ymaps);
        }

        global.ymapscb = (ymaps) => {
            if (ymaps.Map && ymaps.projection) {
                resolve(ymaps);
            } else {
                setTimeout(() => global.ymapscb(ymaps), 100);
            }
        };
        loadScript(YMAPS_URL);
    });
}

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}