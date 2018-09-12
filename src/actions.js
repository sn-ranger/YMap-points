import isEqual from 'lodash/isEqual';
import {geocode} from './YandexMap'

const set = (model, dispatch) => {
    dispatch({type: 'POINTS_SET', model: model})
};

const setMap = (model, dispatch) => {
    dispatch({type: 'MAP_SET', model: model})
};

export function mapApiAvailable() {
    return (dispatch) => {
        setMap({apiAvailable: true}, dispatch)
    }
}

export function mapBoundsChange(event) {
    return (dispatch) => {
        const newCenter = event.get('newCenter');
        const oldCenter = event.get('oldCenter');
        if (!isEqual(newCenter, oldCenter)) setMap({center: newCenter}, dispatch);
    }
}

export const change = (field, value) => {
    return (dispatch) => {
        dispatch({type: 'POINTS_CHANGE', field, value});
    }
};

export function markerDragging(index, newCoords) {
    return (dispatch, getState) => {
        let {points: {markers}} = getState();
        markers[index].coords = newCoords;

        set({markers}, dispatch);
    }
}

export function markerDragEnd(index, newCoords) {
    return async (dispatch, getState) => {
        let {points: {markers}} = getState();
        let marker = markers[index];
        marker.address = await getAddrByCoords(newCoords);
        markers[index] = marker;
        set({markers}, dispatch);
    }
}

async function getAddrByCoords(coords) {
    let gCode = new geocode(coords, {json: true});
    let gCodeResult = await gCode.geocode;
    return gCodeResult.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted;
}

export function submit() {
    return async (dispatch, getState) => {
        await addPoint(dispatch, getState)
    }
}

async function addPoint(dispatch, getState) {
    let {map: {center: [lat, lon]}, points: {pointName, markers}} = getState();
    const index = markers.length;
    const address = await getAddrByCoords([lat, lon]);
    markers.push({
        index,
        address,
        id: `point-${index + 1}`,
        name: pointName,
        coords: [lat, lon]
    });
    set({markers, pointName: ''}, dispatch);
}

export function delPoint(pointIndex) {
    return (dispatch, getState) => {
        let {points: {markers}} = getState();
        markers = markers.filter((v)=>{return v.index !== +pointIndex});
        setMarkersIndexes(markers);
        set({markers}, dispatch);
    }
}

export function handleMarkerListDragging(result) {
    if (!result.destination) return;

    return (dispatch, getState)=> {
        let {points: {markers}} = getState();
        markers = reorder(markers, result.source.index, result.destination.index);
        set({markers}, dispatch)
    }
}

function setMarkersIndexes(markersArray) {
    markersArray.forEach((v, i)=>{
        v.index = i;
    })
}

function reorder(list, startIndex, endIndex) {
    const res = list;
    const [rem] = res.splice(startIndex, 1);
    res.splice(endIndex, 0 ,rem);

    return res;
}