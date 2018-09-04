import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import MapElement from './MapElement';
import MapController from './controllers/mapController';
import {eventsDecorator} from './utils/decorators';
import api from "./api";
import isEqual from 'lodash/isEqual';

const mapEvents = ['actionbegin', 'actionbreak', 'actionend', 'actiontick', 'actiontickcomplete', 'balloonclose', 'balloonopen', 'boundschange', 'click', 'contextmenu', 'dblclick', 'destroy', 'hintclose', 'hintopen', 'marginchange', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseup', 'multitouchend', 'multitouchmove', 'multitouchstart', 'optionschange', 'sizechange', 'typechange', 'wheel'];

class YandexMap extends Component {
    state = {
        isAPILoaded: false
    };

    static propTypes = {
        apiKey: PropTypes.string,
        onAPIAvailable: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        zoom: PropTypes.number,
        state: PropTypes.object,
        options: PropTypes.object,
        loadOptions: PropTypes.object,
        bounds: PropTypes.array
    };
    static defaultProps = {
        zoom: 10,
        center: [55, 45],
        width: 600,
        height: 600,
        bounds: undefined,
        state: {
            controls: []
        },
        options: {},
        loadOptions: {},
        style: {
            position: 'relative'
        }
    };
    static childContextTypes = {
        mapController: PropTypes.object,
        coordorder: PropTypes.oneOf(['latlong', 'longlat'])
    };

    getChildContext(){
        return {
            mapController: this._controller,
            coordorder: this.props.loadOptions.coordorder || 'latlong'
        }
    }

    getController(){
        return this._controller ? this._controller : null;
    }

    componentWillReceiveProps(nextProps){
        let _this = this;

        this._controller && Object.keys(nextProps).forEach((key)=>{
            switch (key) {
                case 'controls':
                    _this._controller.setState(key, nextProps[key]);
                    break;
                case 'center':
                    if (!isEqual(_this.props.center, nextProps.center)) _this._controller.setCenter(nextProps.center);
                    break;
                case 'zoom':
                    if (_this.props.zoom !== nextProps.zoom) _this._controller.setZoom(nextProps.zoom);
                    break;
                case 'bounds':
                    if (!isEqual(_this.props.bounds, nextProps.bounds)) _this._controller.setBounds(nextProps.bounds);
                    break;
                default:
                    break;
            }
        })
    }

    componentDidMount() {
        if (api.isAvailable()) {
            this._onAPILoad(api.getApi());
        } else {
            api.load(this.props.loadOptions).then(this._onAPILoad.bind(this)).catch((err)=>{
                return console.log('Error: %s', err)
            })
        }
    }

    render() {
        return <div style={this._getStyle()}>
            <MapElement ref="mapContainer"/>
            {this.state.isAPILoaded ? this.props.children : null}
        </div>
    }

    _getStyle() {
        return {
            ...this.props.style,
            width: typeof this.props.width === 'string' ? this.props.width : this.props.width + 'px',
            height: typeof this.props.height === 'string' ? this.props.height : this.props.height + 'px'
        }
    }

    _onAPILoad(namespase) {
        this.props.onAPIAvailable && this.props.onAPIAvailable(namespase);

        this._controller = new MapController();
        this._controller.createMap(findDOMNode(this.refs.mapContainer), {
            ...this.props.state,
            center: this.props.center,
            zoom: this.props.zoom,
            bounds: this.props.bounds
        }, {...this.props.options});

        this._setupEvents();
        this.setState({isAPILoaded: true});

        if (this.props.onMapAvailable) this.onMapAvailable(this._controller.map)
    }

}

export default eventsDecorator(YandexMap, { supportEvents: mapEvents });