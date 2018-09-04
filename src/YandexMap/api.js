import {loadApi} from './utils/loadApi';

class Api {
    constructor(){
        this.api = typeof window !== 'undefined' && window.ymaps ? window.ymaps : null;
    }
    setApi(instance) {
        this.api = instance;
        return this.api;
    }
    getApi() {
        return this.api;
    }
    isAvailable() {
        return !!this.api
    }
    load() {
        let _this = this;
        const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return loadApi(options).then((instance)=>{
            _this.api = instance;
            return instance;
        })
    }
}

export default new Api();