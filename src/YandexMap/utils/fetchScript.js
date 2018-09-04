export default function fetchScript(url) {
    return new Promise(function (resolve, reject) {
        let script = document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.src = url;

        let beforeScript = document.getElementsByTagName('script')[0];
        beforeScript.parentNode.insertBefore(script, beforeScript);
    });
}