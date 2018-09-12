import Api from '../api';

export default class Geocode {
    constructor(coordinates){
        const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this.options = options;
        this._geocode = Api.getApi().geocode(coordinates, options);
    }

    get geocode() { return this._geocode }
}