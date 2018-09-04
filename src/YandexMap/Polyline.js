import {Component} from 'react';
import PropTypes from 'prop-types';
import PolylineController from './controllers/polylineController';
import isEqual from 'lodash/isEqual';
import {eventsDecorator} from "./utils/decorators";
import {geoObjectEvents} from "./utils/allowedEvents";

class Polyline extends Component {
    constructor() {
        super();
        this.options = {}
    }

    static propTypes = {
        geometry: PropTypes.array.isRequired,
        properties: PropTypes.object,
        options: PropTypes.object,
        balloonState: PropTypes.oneOf(['opened', 'closed'])
    };
    static defaultProps = {
        balloonState: 'closed'
    };
    static contextTypes = {
        mapController: PropTypes.object
    };

    componentDidMount() {
        let _props = this.props;
        const {geometry, properties, options} = _props;

        this._controller = new PolylineController(geometry, properties, options);

        this._setupEvents();

        this.context.mapController.appendPolyline(this._controller);
    }

    componentDidUpdate(prevProps) {
        let _this = this, _props = this.props;
        let {geometry, properties = {}, options = {}, balloonState} = _props;

        if (!isEqual(geometry, prevProps.geometry)) this._controller.setGeometry(geometry);

        Object.keys(properties).forEach((propName) => {
            if (!prevProps.properties || properties[propName] !== prevProps.properties[propName]) {
                _this._controller.setProperty(propName, properties[propName])
            }
        });

        Object.keys(options).forEach((optName)=>{
            if (!prevProps.options || options[optName] !== prevProps.options[optName]) {
                _this._controller.setOption(optName, options[optName])
            }
        });

        this._controller.setBalloonState(balloonState);
    }

    componentWillUnmount() {
        this._controller.destroy();
    }

    getController() {
        return this._controller ? this._controller : null;
    }

    render() { return null }
}

export default eventsDecorator(Polyline, {supportEvents: geoObjectEvents});