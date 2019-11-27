import React from 'react';

export default class Victory extends React.Component {

    render() {
        return (
            <h1>
               {this.props.playerId} has won! <br/>
               <button onClick={() => this.props.rematch()}>Rematch!</button>
            </h1>
        )
    }
}