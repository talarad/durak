import React from 'react';
import Victory from './Victory.js';

export default class Arena extends React.Component {
    constructor() {
        super()

        this.showAttackCards = this.showAttackCards.bind(this);
    }

    showDefenseCard(defenseCard, index) {
        if (defenseCard) {
            let cardId = "defense" + index;
            return (
                <div key={defenseCard.key} id={cardId} className="defense-card" onClick={() => this.props.onCardArenaClick(defenseCard, defenseCard.index)}>
                    <img src={require(defenseCard.image)} alt={defenseCard.index} width="85px" height="120px" />
                </div>
            )
        }
    }

    showAttackCards() {
        return (
            this.props.attack.map((attackCard, attackIndex) => {
                const defenseCard = this.props.defense[attackIndex];
                let cardId = "attack" + attackIndex;
                return (
                    <div key={attackCard.key} id={cardId} className="attack-card" onClick={() => this.props.onCardArenaClick(attackCard, attackIndex)}>
                        <img src={require(attackCard.image)} alt={attackCard.index} width="85px" height="120px" />
                        {this.showDefenseCard(defenseCard, attackIndex)}
                    </div>
                )
            }))
    }

    render() {
        if (this.props.playerId) {
            return (
                <Victory rematch={this.props.rematch} playerId={this.props.playerId} />
            )
        } else if (this.props.canPass !== false) {
            return (
                <div>
                    {this.showAttackCards()}<br />
                    <button onClick={() => this.props.passWithSameCard()}>Pass with another {this.props.canPass}!</button>
                </div>
            )
        } else {
            return (
                <div>
                    {this.showAttackCards()}
                </div>
            )
        }
    }
}