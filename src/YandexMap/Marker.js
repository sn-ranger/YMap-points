import React, {Component} from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import {eventsDecorator} from './utils/decorators';
import MarkerController from './controllers/markerController';
import BalloonLayout from './BalloonLayout';
import MarkerLayout from './MarkerLayout';
import {geoObjectEvents} from './utils/allowedEvents';

class MapMarker extends Component {
    constructor() {
        super();
        this.options = {};
    }

    static propTypes = {
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
        properties: PropTypes.object,
        options: PropTypes.object,
        balloonState: PropTypes.oneOf(['opened', 'closed'])
    };
    static defaultProps = {
        balloonState: 'closed'
    };
    static contextTypes = {
        mapController: PropTypes.object,
        coordorder: PropTypes.oneOf(['latlong', 'longlat'])
    };

    componentDidMount() {
        let _props = this.props;
        const {lat, lon, properties, options, balloonState} = _props;
        const coords = this.context.coororder === 'longlat' ? [lon, lat] : [lat, lon];

        this._controller = new MarkerController(coords, properties, options, balloonState);

        this._setupLayouts();
        this._setupEvents();

        this.context.mapController.appendMarker(this._controller);
    }

    componentDidUpdate(prevProps) {
        let _this = this, _props = this.props;
        let {lat, lon, children, properties = {}, options = {}, balloonState} = _props;

        if (lat !== prevProps.lat || lon !== prevProps.lon) {
            this._controller.setPosition(this.context.coordorder === 'longlat' ? [lon, lat] : [lat, lon]);
        }

        Object.keys(properties).forEach((propName)=>{
            if (!prevProps.properties || properties[propName] !== prevProps.properties[propName]) {
                _this._controller.setProperty(propName, properties[propName]);
            }
        });

        Object.keys(options).forEach((optName)=>{
            if (!prevProps.options || options[optName] !== prevProps.options[optName]) {
                _this._controller.setProperty(optName, options[optName]);
            }
        });

        this._controller.setBalloonState(balloonState);

        if (children != prevProps.children) {
            this._clearLayouts();
            this._setupLayouts();
        }
    }

    componentWillUnmount() {
        this._clearLayouts();
        this._controller.destroy();
    }

    getController() {
        return this._controller ? this._controller : null;
    }

    _setupLayouts() {
        let _this = this;

        React.Children.toArray(this.props.children).forEach((component) => {
            if (component.type === BalloonLayout) {
                _this._setupBalloonLayout(component)
            }
            if (component.type === MarkerLayout) {
                _this._setupMarkerLayout(component)
            }
        })
    }

    _setupBalloonLayout(component) {
        this._balloonElement = document.createElement('div');

        ReactDom.render(component, this._balloonElement);
        this._controller.setLayout('balloonLayout', this._balloonElement);
    }

    _setupMarkerLayout(component) {
        this._markerElement = document.createElement('div');
        this._markerElement.className = 'icon-content';
        this._markerElement.style.display = 'inline-block';

        ReactDom.render(component, this._markerElement);
        this._controller.setLayout('iconLayout', this._markerElement);
    }

    _clearLayouts() {
        if (this._markerElement) {
            ReactDom.unmountComponentAtNode(this._markerElement);
            this._markerElement = null;
        }
        if (this._balloonElement) {
            ReactDom.unmountComponentAtNode(this._balloonElement);
            this._balloonElement = null;
        }
    }

    render() {return null}
}

export default eventsDecorator(MapMarker, {supportEvents: geoObjectEvents});