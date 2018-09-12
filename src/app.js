import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as mapActions from './actions';
import {Map, Marker, Polyline} from './YandexMap';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

function mapStateToProps(state) {
    return {
        model: state.points,
        map: state.map
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mapActions, dispatch)
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.actions.submit()
    };

    handleApiLoaded = ()=>{
        this.props.actions.mapApiAvailable();
    };

    handleChange = (e) => {
        this.props.actions.change(e.target.name, e.target.value)
    };

    handleDragMap = (e) => {
        this.props.actions.mapBoundsChange(e);
    };

    handleDragEndMapMarker = (index) => (e) => {
        this.props.actions.markerDragEnd(index, e.get('target').geometry.getCoordinates())
    };

    handleDragMapMarker = (index) => (e) => {
        this.props.actions.markerDragging(index, e.get('target').geometry.getCoordinates());
    };

    handleDelClick = (pointIndex) => () => {
        this.props.actions.delPoint(pointIndex);
    };

    handleDragMarkerListEl = (result) => {
        this.props.actions.handleMarkerListDragging(result)
    };

    render() {
        const {model: {markers, pointName}, map } = this.props;

        const markersList = markers.map((v, i) => {
            return (
                <Draggable key={v.id} draggableId={v.id} index={i}>
                    {(provided) => <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="point-el">
                        <p className="point-name">{v.name}</p>
                        <i className="point-del" onClick={this.handleDelClick(v.index)}/>
                    </div>}
                </Draggable>
            )
        });

        const pointList = markers.map(v=>{
            return v.coords
        });

        const mapMarkers = markers.map( (v) => {
            const [lat, lon] = v.coords;
            let markerProperties = {balloonContentHeader: v.name};
            if (v.address) markerProperties.balloonContentBody = v.address;
            return <Marker
                key={v.id}
                lat={lat} lon={lon}
                properties={markerProperties}
                options={{draggable: true}}
                onDrag={this.handleDragMapMarker(v.index)}
                onDragend={this.handleDragEndMapMarker(v.index)}
            />
        });

        return <div className={'container'}>
            <div className="row">
                <div className="col-3 form-container">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="point-name">Введите название точки:</label>
                            <input onChange={this.handleChange} className="form-control" type="text" name="pointName" id="point-name" value={pointName} />
                        </div>
                    </form>
                    <DragDropContext onDragEnd={this.handleDragMarkerListEl}>
                        <Droppable droppableId="droppable">
                            {(provided) => <div ref={provided.innerRef} className="points-container">
                                {markersList}
                                {provided.placeholder}
                            </div>}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="col-8 map-container">
                    <Map
                        onAPIAvailable={this.handleApiLoaded}
                        center={map.center}
                        properties={{
                            searchControlProvider: 'yandex#search'
                        }}
                        state={map.state}
                        zoom={10}
                        onBoundschange={this.handleDragMap}
                    >
                        {mapMarkers}
                        <Polyline geometry={pointList} />
                    </Map>
                </div>
            </div>
        </div>;
    }
}