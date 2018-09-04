import Api from '../api';

export default class PolylineController {
    constructor(geometry) {
        const properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        const balloonState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        this._geometry = geometry;
        this.properties = properties;
        this.options = options;
        this.balloonState = balloonState;
        this._polyline = new (Api.getApi().Polyline)(geometry, null, null);
        this.setupProperties();
        this.setupOptions();
        this.events = this._polyline.events.group();
    }

    getAPIInstance() { return this._polyline }
    getGeometry() { return this._geometry }
    setGeometry(geometry) { this._polyline.geometry.setCoordinates(geometry) }
    setProperty(propName, value) { this._polyline.properties.set(propName, value) }
    setOption(optName, value) { this._polyline.options.set(optName, value) }
    setBalloonState(state) {
        if (state === 'opened') {
            if (!this._polyline.balloon.isOpen()) this._polyline.balloon.open();
        } else {
            if (this._polyline.balloon.isOpen()) this._polyline.balloon.open();
        }
    }
    setupProperties() {
        let _this = this;
        const {properties} = this;

        Object.keys(properties).forEach((propName)=>{
            _this.setProperty(propName, properties[propName])
        })
    }
    setupOptions() {
        let _this = this;
        const {options} = this;

        Object.keys(options).forEach((optName) => {
            _this.setOption(optName, options[optName])
        })
    }
    destroy() {
        this.events.removeAll();
        this._polyline.setParent(null);
        this._polyline = null;
    }
}