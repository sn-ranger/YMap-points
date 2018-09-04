import Api from '../api';

class MapController {
    createMap(container, state, options){
        this._map = new (Api.getApi().Map)(container, state, options);
        this.events = this._map.events.group();

        this._setupCollection();

        return this;
    }

    appendMarker(marker) {
        this.geoCollection.add(marker.getAPIInstance());
        marker.setBalloonState(marker.balloonState);
    }

    appendPolyline(polyline) {
        this.geoCollection.add(polyline.getAPIInstance());
    }

    setOptions(name, value) { this._map.options.set(name, value) }
    setCenter(coords) { this._map.setCenter(coords) }
    setZoom(zoom) { this._map.setZoom(zoom) }
    setBounds(bounds) { this._map.setBounds(bounds) }
    setState(name, value) { this._map.state.set(name, value) }

    destroy() {
        this.events.removeAll();
        this._map.destroy();
    }

    _setupCollection(){
        this.geoCollection = new (Api.getApi().GeoObjectCollection)();
        this._map.geoObjects.add(this.geoCollection);
    }

    get map() { return this._map }
}

export default MapController;