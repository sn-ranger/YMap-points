import Api from '../api';
import Layouts from './layouts';

export default class MarkerController {
    constructor(coordinates) {
        const properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        const balloonState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        this.properties = properties;
        this.options = options;
        this.balloonState = balloonState;
        this._coordinates = coordinates;
        this._marker = new (Api.getApi().Placemark)(coordinates, null, null);
        this.setupMarkerProperties();
        this.setupMarkerOptions();
        this.events = this._marker.events.group();
    }

    getAPIInstance() { return this._marker }
    getCoordinates() { return this._coordinates }
    setPosition(coords) { this._marker.geometry.setCoordinates(coords) }
    setProperty(propName, value) { this._marker.properties.set(propName, value) }
    setOption(optName, value) { this._marker.options.set(optName, value) }
    setBalloonState(state) {
        if (state === 'opened') {
            if (!this._marker.balloon.isOpen()) {this._marker.balloon.open()}
        } else {
            if (this._marker.balloon.isOpen()) {this._marker.balloon.close()}
        }
    }
    setLayout(name, element) {
        let layout = void 0;

        if (name === 'iconLayout') {
            layout = Layouts.createIconLayoutClass(element)
        } else if (name === 'balloonLayout') {
            layout = Layouts.createBalloonLayoutClass(element)
        }

        this._marker.options.set(name, layout)
    }

    destroy() {
        this.events.removeAll();
        this._marker.setParent(null);
        this._marker = null;
    }

    setupMarkerProperties() {
        let _this = this;
        const {properties} = this;

        Object.keys(properties).forEach((propName)=>{
            _this.setProperty(propName, properties[propName])
        })
    }
    setupMarkerOptions() {
        let _this = this;
        const {options} = this;

        Object.keys(options).forEach((optName)=>{
            _this.setOption(optName, options[optName])
        });
    }
}