import React from 'react';
//import { createStore } from 'redux'
import cards from './cards.js';
import Player from './Player.js';
import Deck from './Deck.js';
import Arena from './Arena.js';

const numberOfCardsInHand = 6;
const numOfPlayers = 4;
let deck;
deck = shuffleArray(cards);

const initialState = {
  playersDecks: [[]],
  gameDeck: deck,
  strongKind: deck[0].kind,
  clickedCard: undefined,
  boardAttack: [],
  boardDefense: [],
  attacker: 0,
  defense: 1,
}

for (let i = 1; i < numOfPlayers; i++) {
  initialState.playersDecks.push([]);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export default class App extends React.Component {
  constructor() {
    super()

    this.updateCards = this.updateCards.bind(this);
    this.onCardClick = this.onCardClick.bind(this);
    this.onCardArenaClick = this.onCardArenaClick.bind(this);
    this.checkValidityOfDefense = this.checkValidityOfDefense.bind(this);
    this.checkValidityOfAttack = this.checkValidityOfAttack.bind(this);
    this.finishTurn = this.finishTurn.bind(this);
    this.isAttackerOrDefender = this.isAttackerOrDefender.bind(this);
    this.checkVictory = this.checkVictory.bind(this);
    this.canPass = this.canPass.bind(this);
    this.passWithSameCard = this.passWithSameCard.bind(this);
    this.setAttackerAndDefender = this.setAttackerAndDefender.bind(this);
    this.lengthOfBoardDef = this.lengthOfBoardDef.bind(this);
    this.checkIfDefenderCanPressCard = this.checkIfDefenderCanPressCard.bind(this);
    this.rematch = this.rematch.bind(this);

    this.state = initialState;
  }

  componentWillMount() {
    this.updateCards();
  }

  checkValidityOfDefense(card) {
    if ((card.kind === this.state.clickedCard.kind && card.number < this.state.clickedCard.number) || (card.kind !== this.state.strongKind && this.state.clickedCard.kind === this.state.strongKind)) {
      return true;
    } else {
      return false;
    }
  }

  onCardArenaClick(card, indexInAttackArr) {
    if (this.state.boardDefense[indexInAttackArr] === undefined) {
      if (card.playerId !== this.state.defense) {
        if (this.state.clickedCard) {
          if (this.checkValidityOfDefense(card)) {
            
            const playersDecks = [...this.state.playersDecks];
            const defenderDeck = playersDecks[this.state.defense];
            const boardDefense = [...this.state.boardDefense];

            defenderDeck.forEach((card, index) => {
              if (card === this.state.clickedCard) {
                defenderDeck.splice(index, 1);
              }
            });

            boardDefense[indexInAttackArr] = this.state.clickedCard;
            playersDecks[this.state.defense] = defenderDeck;
            this.setState({ boardDefense, playersDecks, clickedCard: undefined });
          }
        }
      }
    }
  }

  checkValidityOfAttack(selectedCard) {
    if (this.state.boardAttack.length === 0) {
      return true;
    } else {
      let isValid = false;

      this.state.boardAttack.concat(this.state.boardDefense).forEach(card => {
        if (card && selectedCard.number === card.number) {
          isValid = true;
        }
      })

      return isValid
    }
  }

  onCardClick(clickedCard, playerId) {
    let boardAttack = [...this.state.boardAttack];;

    if (this.checkIfAttackerCanPressCard(clickedCard, playerId) || (this.state.boardAttack.length === 0 && this.state.attacker === playerId)) {
      if (this.checkValidityOfAttack(clickedCard)) {
        const playersDecks = [...this.state.playersDecks];
        const playerDeck = playersDecks[playerId];

        boardAttack.push(clickedCard);
        playerDeck.forEach((card, index) => {
          if (card === clickedCard) {
            playerDeck.splice(index, 1);
          }
        });

        playersDecks[playerId] = playerDeck;
        this.setState({ boardAttack, playersDecks })
      }
    } else if (this.checkIfDefenderCanPressCard(clickedCard, playerId)) {
      this.setState({ clickedCard });
    }
  }

  checkIfAttackerCanPressCard(clickedCard, playerId) {
    return (this.state.boardAttack.length !== 0 && this.state.defense !== playerId && clickedCard.playerId === playerId && this.state.boardAttack.length < numberOfCardsInHand && this.state.boardAttack.length - this.lengthOfBoardDef() < this.state.playersDecks[this.state.defense].length)
  }

  checkIfDefenderCanPressCard(clickedCard, playerId) {
    return (this.state.defense === playerId && clickedCard.playerId === playerId && this.lengthOfBoardDef() < numberOfCardsInHand && this.state.boardAttack.length !== 0)
  }

  checkVictory() {
    if (this.state.gameDeck.length === 0) {
      for (let i = 0; i < numOfPlayers; i++) {
        if (this.state.playersDecks[i].length === 0) {
          return `Player ${i}`;
        }
      }
    }

    return false;
  }

  updateCards() {
    let currentPlayer = this.state.attacker + 1 < numOfPlayers ? this.state.attacker + 1 : 0;
    let playersDecks = [...this.state.playersDecks];
    let gameDeck = [...this.state.gameDeck];

    for (let i = 0; i < numOfPlayers; i++) {
      while (gameDeck.length > 0 && playersDecks[currentPlayer].length < numberOfCardsInHand) {
        let card = gameDeck.pop();
        card.playerId = currentPlayer;
        playersDecks[currentPlayer].push(card);
      }

      currentPlayer = currentPlayer + 1 >= numOfPlayers ? 0 : currentPlayer + 1;
    }

    this.setState({ playersDecks, gameDeck })
  }

  finishTurn(e, playerId) {
    if (this.state.attacker === playerId && this.state.boardAttack.length === this.lengthOfBoardDef()) {
      let attacker = this.state.defense;
      let defense = attacker < numOfPlayers - 1 ? attacker + 1 : 0;
      this.setState({ attacker, defense, boardAttack: [], boardDefense: [] }, () => this.updateCards());

    } else if (this.state.defense === playerId) {
      const playersDecks = [...this.state.playersDecks];
      const playerDeck = [...this.state.playersDecks[playerId]];

      this.state.boardAttack.concat(this.state.boardDefense).forEach(card => {
        if (card) {
          card.playerId = playerId;
          playerDeck.push(card);
        }
      })

      this.setAttackerAndDefender(true);
      playersDecks[playerId] = playerDeck;
      this.setState({ playersDecks, boardAttack: [], boardDefense: [] }, () => this.updateCards());
    }
  }

  setAttackerAndDefender(skipDefender) {
    let attacker = this.state.attacker;
    let defense = this.state.defense;
    if (!skipDefender) {
      attacker = defense;
      defense = attacker < numOfPlayers - 1 ? attacker + 1 : 0;
    } else {
      if (defense < numOfPlayers - 1) {
        attacker = defense + 1;
        defense = (attacker < numOfPlayers - 1) ? attacker + 1 : defense = 0;
      } else {
        attacker = 0;
        defense = 1;
      }
    }

    this.setState({ attacker, defense })
  }

  isAttackerOrDefender(playerId) {
    if (playerId === this.state.attacker) {
      return "attacker";
    }
    if (playerId === this.state.defense) {
      return "defense";
    }

    return false;
  }

  rematch() {
    deck = shuffleArray(cards);
    initialState.gameDeck = deck;
    initialState.strongKind = deck[0].kind ;
    initialState.playersDecks = [[]];

    for (let i = 1; i < numOfPlayers; i++) {
      initialState.playersDecks.push([]);
    }

    initialState.attacker = this.state.playersDecks.filter((deck, index) => {
      if(deck.length === 0)
      return index;
    })
    
    this.setState(initialState, () => this.updateCards());

    console.log(deck)
  }

  canPass() {
    let canPass = false;
    const boardAttack = this.state.boardAttack, defenseDeck = this.state.playersDecks[this.state.defense];

    if (this.lengthOfBoardDef() === 0 && boardAttack.length > 0) {
      let number = boardAttack[0].number;

      for (let i = 0; i < defenseDeck.length; i++) {
        if (defenseDeck[i].number === number) {
          canPass = true;
        }
      }

      for (let i = 1; i < boardAttack.length; i++) {
        if (boardAttack[i].number !== number) {
          canPass = false;
          number = false;
        }
      }

      if (canPass) {
        return number;
      } else {
        return false;
      }
    }

    return false;
  }

  passWithSameCard() {
    if (this.state.clickedCard !== undefined && this.state.clickedCard.playerId === this.state.defense) {
      if (this.state.clickedCard.number === this.state.boardAttack[0].number) {
        const playersDecks = [...this.state.playersDecks];
        const defenderDeck = playersDecks[this.state.defense];
        const boardAttack = this.state.boardAttack;

        boardAttack.forEach((card) => {
          card.playerId = this.state.defense;
        });

        boardAttack.push(this.state.clickedCard);

        defenderDeck.forEach((card, index) => {
          if (card === this.state.clickedCard) {
            defenderDeck.splice(index, 1);
          }
        });

        this.setAttackerAndDefender(false);

        playersDecks[this.state.defense] = defenderDeck;
        this.setState({ playersDecks, boardAttack, clickedCard: undefined });
      }
    }
  }

  lengthOfBoardDef() {
    let counter = 0;

    (this.state.boardDefense).forEach(card => {
      if (card) {
        counter++;
      }
    })

    return counter;
  }

  render() {
    const result = this.checkVictory();
    const boardDefense = this.lengthOfBoardDef();

    return (
      <div className="container">
        <div className="player1">
          <Player boardAttack={this.state.boardAttack.length} boardDefense={boardDefense} finishTurn={this.finishTurn} isAttackerOrDefender={this.isAttackerOrDefender(0)}
            defense={this.state.defense} playerId={0} strongKind={this.state.strongKind} onCardClick={this.onCardClick}
            clickedCard={this.state.clickedCard} updateBoard={this.updateBoard} deck={this.state.playersDecks[0]} />
        </div>
        <div className="arena">
          <Arena passWithSameCard={this.passWithSameCard} canPass={this.canPass()} rematch={this.rematch} playerId={result}
            onCardArenaClick={this.onCardArenaClick} attack={this.state.boardAttack} defense={this.state.boardDefense} />
        </div>
        <div className="player2">
          <Player boardAttack={this.state.boardAttack.length} boardDefense={boardDefense} finishTurn={this.finishTurn} isAttackerOrDefender={this.isAttackerOrDefender(1)}
            defense={this.state.defense} playerId={1} strongKind={this.state.strongKind} onCardClick={this.onCardClick}
            clickedCard={this.state.clickedCard} updateBoard={this.updateBoard} deck={this.state.playersDecks[1]} />
        </div>
        <div className="player3">
          <Player boardAttack={this.state.boardAttack.length} boardDefense={boardDefense} finishTurn={this.finishTurn} isAttackerOrDefender={this.isAttackerOrDefender(2)}
            defense={this.state.defense} playerId={2} strongKind={this.state.strongKind} onCardClick={this.onCardClick}
            clickedCard={this.state.clickedCard} updateBoard={this.updateBoard} deck={this.state.playersDecks[2]} />
        </div>
        <div className="player4">
          <Player boardAttack={this.state.boardAttack.length} boardDefense={boardDefense} finishTurn={this.finishTurn} isAttackerOrDefender={this.isAttackerOrDefender(3)}
            defense={this.state.defense} playerId={3} strongKind={this.state.strongKind} onCardClick={this.onCardClick}
            clickedCard={this.state.clickedCard} updateBoard={this.updateBoard} deck={this.state.playersDecks[3]} />
        </div>
        <div className="deck">
          <Deck deck={this.state.gameDeck} />
        </div>
      </div>
    )
  }
}