import React, {Component} from 'react';

export default class BalloonLayout extends Component {
    render() {
        return <div>{this.props.children}</div>
    }
}