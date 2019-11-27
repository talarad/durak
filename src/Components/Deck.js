import React from 'react';

export default class Deck extends React.Component {
    constructor() {
        super()

        this.showCards = this.showCards.bind(this);
    }

    showCards() {
        const numOfBackCards = this.props.deck.length;

        if (numOfBackCards === 1) {
            return (
                <div className="card" >
                    <img src={require(this.props.deck[0].image)} width="85px" height="120px" alt={this.props.deck[0].index} />
                </div>
            )
        }

        if (numOfBackCards >= 2) {
            return (
                <div>
                    <div className="last-card" >
                        <img src={require(this.props.deck[0].image)} width="85px" height="120px" alt={this.props.deck[0].index} />
                    </div>
                    <div className="cardBackwards">
                        <img src={require("./images/Gray_back.jpg")} width="85px" height="120px" alt="Gray_back" /> 

                    </div> 
                    <br/>
                        {numOfBackCards - 1} more cards
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.showCards()}
            </div>
        )
    }
}