import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function GameButton(props) {
  return (
    <li>
      <input style={{ fontWeight: props.isBold}}type="button" value={props.text} onClick={props.onClick}/>
    </li>
  )
}

class GameHistory extends React.Component {
  render() {
    const history = this.props.history;
    const coords = getCoords(history);
    const gameHistory = history.map((squares, i) => {
      const style = (i === this.props.currentMove) ? 'bold' : '';
      if (i === 0) {
        const moveText = "Go to game start";
        return (
          <GameButton isBold={style} key={i.toString()} text={moveText} onClick={() => this.props.onCurrentMoveChange(i)}/>
        )
      }
      else {
        const prevPlayer = i % 2 === 0 ? 'O' : 'X';
        const loc = coords[i-1];
        const desc = "Go to move #" + i.toString() + ". Player " + prevPlayer + ": " + loc;
        return (
          <GameButton isBold={style} key={i.toString()} text={desc} onClick={() => this.props.onCurrentMoveChange(i)}/>
        )
      }
    })
    if (this.props.isAscending) {
      gameHistory.reverse();
    }

    return (
      <div>
        <p>
          <input type="button" value="Toggle Order" onClick={this.props.onAscendingChange}/>
        </p>
        <div>
          {gameHistory}
        </div>
      </div>
    )
  }
}

function Square(props) {
  let winner = props.isWinner ? 'green' : '';

  return (
    <input
      style={{ backgroundColor: winner }}
      type="button"
      value={props.value} 
      className="square"
      onClick={props.onClick}/>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.onSquareClick(i);
  }

  renderSquare(i, winner) {
    return <Square key={i} isWinner={winner} value={this.props.squares[i]} onClick={() => this.handleClick(i)}/>
  }

  render() {
    const winningSquares = this.props.winningSquares;
    let boardRows = [];
    let i = 0;
    for (let row = 0; row < 3; row++) {
      let squareElements = [];
      for (let col = 0; col < 3; col++) {
        let winner = winningSquares.includes(i) ? true : false;
        squareElements.push(this.renderSquare(i, winner));
        i++;
      }
      boardRows.push(
        <div key={i} className="board-row">
          {squareElements}
        </div>
      )
    }

    return (
      <div>
        {boardRows}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill('')],
      currentMove: 0,
      isAscending: false
    }
    this.handleCurrentMoveChange = this.handleCurrentMoveChange.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleAscendingChange = this.handleAscendingChange.bind(this);
  }

  handleSquareClick(i) {
    const currentMove = this.state.currentMove;
    var history = this.state.history;
    const move = history[currentMove].slice();
    if (checkWinner(move)[0]) {
      return;
    }
    else if (move[i] !== '') {
      return;
    }
    const player = currentMove % 2 === 0 ? 'X' : 'O';
    move[i] = player;
    if (currentMove !== history.length - 1) {
      history = history.slice(0, currentMove+1);
    }
    history.push(move);
    this.setState({history: history, currentMove: currentMove + 1})
  }

  handleCurrentMoveChange(move) {
    this.setState({currentMove: move})
  }

  handleAscendingChange() {
    this.setState({isAscending: !this.state.isAscending})
  }

  render() {
    const currentMove = this.state.currentMove;
    const squares = this.state.history[currentMove];
    const player = currentMove % 2 === 0 ? 'X' : 'O';
    const [winner, winningSquares] = checkWinner(squares);
    let nextPlayer;
    if (winner) {
      nextPlayer = 'Winner: ' + winner;
    }
    else if (!squares.includes('')) {
      nextPlayer = 'The game is a draw!b'
    }
    else {
      nextPlayer = 'Next Player: ' + player;
    }
    
    const gameHistory = <GameHistory
                          currentMove={currentMove}
                          history={this.state.history}
                          onCurrentMoveChange={this.handleCurrentMoveChange}
                          isAscending={this.state.isAscending}
                          onAscendingChange={this.handleAscendingChange}/>
    const reversedGameHistory = this.state.isAscending ? <ol reversed>{gameHistory}</ol> : <ol>{gameHistory}</ol>

    return (
      <div>
        <div>
          <Board squares={squares} winningSquares={winningSquares} onSquareClick={this.handleSquareClick}/>
        </div>
        <div>
          <p>{nextPlayer}</p>
          {reversedGameHistory}
        </div>
      </div>
    )
  }
}

function checkWinner(squares) {
  if ((squares[4] && squares[0] === squares[4] && squares[4] === squares[8])) {
    return [squares[4], [0, 4, 8]];
  }
  else if ((squares[4] && squares[2] === squares[4] && squares[4] === squares[6])) {
    return [squares[4], [2, 4, 6]];
  }
  for (let i=0; i<3; i++) {
    if (squares[i*3] && squares[i*3] === squares[i*3+1] && squares[i*3+1] === squares[i*3+2]) {
      return [squares[i*3], [i*3, i*3+1, i*3+2]];
    }
    else if (squares[i] && squares[i] === squares[i+3] && squares[i+3] === squares[i+6]) {
      return [squares[i], [i, i+3, i+6]];
    }
  }
  return ['', []];
}

function getCoords(history) {
  const coords = [];
  for (let i = 0; i < history.length - 1; i++) {
    const prevSquares = history[i];
    const currSquares = history[i+1];
    for (let j = 0; j < prevSquares.length; j++) {
      if (prevSquares[j] !== currSquares[j]) {
        coords.push(COORDINATES[j]);
      }
    }
  }
  return coords;
}

const COORDINATES = ['(1, 1)', '(2, 1)', '(3, 1)',
                    '(1, 2)', '(2, 2)', '(3, 2)',
                    '(1, 3)', '(2, 3)', '(3, 3)']

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);