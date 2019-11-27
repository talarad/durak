import React from 'react';

export default class Player extends React.Component {
    constructor() {
        super()
        this.showCards = this.showCards.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
        this.sort = this.sort.bind(this);
        this.state = {
            deck: {}
        }
    }

    sort() {
        let deck = this.props.deck;
        deck.sort((a, b) => a.kind.localeCompare(b.kind));
        let sortedDeck = [];

        for (let i = 0; i < deck.length; i++) {
            let kind = deck[i].kind;
            let iterator = i;
            let tempArr = [];
            while (iterator < deck.length && deck[iterator].kind === kind) {
                tempArr.push(deck[iterator])
                iterator++;
            }

            tempArr.sort(function (a, b) {
                return parseFloat(a.number) - parseFloat(b.number);
            });

            sortedDeck = sortedDeck.concat(tempArr);
            i = iterator - 1;
        }

        deck = sortedDeck
        this.setState({ deck })
    }

    componentWillMount() {
        this.sort();
    }

    componentWillReceiveProps() {
        this.sort();
    }

    cardClicked(card, index) {
        this.props.updateBoard(card);
    }

    showCards() {
        return (
            this.state.deck.map((card, index) => {
                if (card === this.props.clickedCard) {
                    return (
                        <div key={index} id={index} className="picked-card" onClick={() => this.props.onCardClick(card, this.props.playerId)}>
                            <img src={require(card.image)} alt={card.index} width="70px" height="105px" />
                        </div>
                    )
                } else if (card.kind === this.props.strongKind) {
                    return (
                        <div key={index} id={index} className="strong-card" onClick={() => this.props.onCardClick(card, this.props.playerId)}>
                            <img src={require(card.image)} alt={card.index} width="90px" height="140px" />
                        </div>
                    )
                } else {
                    return (
                        <div key={index} id={index} className="card" onClick={() => this.props.onCardClick(card, this.props.playerId)}>
                            <img src={require(card.image)} alt={card.index} width="85px" height="120px" />
                        </div>
                    )
                }
            }
            )
        );
    }

    render() {
        if (this.props.isAttackerOrDefender === "attacker") {
            if (this.props.boardDefense === this.props.boardAttack && this.props.boardAttack !== 0) {
                return (
                    <div>
                        {this.showCards()}
                        <div className="finish-turn-button">
                            <button onClick={(e) => this.props.finishTurn(e, this.props.playerId)}>Finished</button>  My turn!
                        </div>
                    </div>
                )
            } else {
                if (this.props.boardAttack === 0 && this.props.boardDefense === 0) {
                    return (
                        <div>
                            {this.showCards()}
                            <div className="finish-turn-button">
                                <button disabled onClick={(e) => this.props.finishTurn(e, this.props.playerId)}>Finished</button>  My turn!
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            {this.showCards()}
                            <div className="finish-turn-button">
                                <button disabled onClick={(e) => this.props.finishTurn(e, this.props.playerId)}>Finished</button>
                            </div>
                        </div>
                    )
                }
            }
        } else if (this.props.isAttackerOrDefender === "defense") {

            if (this.props.boardDefense !== this.props.boardAttack && this.props.boardAttack !== 0 && this.props.defense === this.props.playerId) {
                return (
                    <div>
                        {this.showCards()}
                        <div className="finish-turn-button">
                            <button onClick={(e) => this.props.finishTurn(e, this.props.playerId)}>Take cards :(</button>  My turn!
                        </div>
                    </div>
                )
            } else {

                return (
                    <div>
                        {this.showCards()}
                        <div className="finish-turn-button">
                            <button disabled onClick={(e) => this.props.finishTurn(e, this.props.playerId)}>Wait for attacker</button>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    {this.showCards()}
                </div>
            )
        }
    }
}