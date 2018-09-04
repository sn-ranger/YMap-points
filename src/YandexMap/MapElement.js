import React, {Component} from 'react';

const style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0
};


class MapElement extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <div style={style}/>
    }
}

export default MapElement;