import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) { // render function for single square 
  return (
    <button className="square" onClick={props.onClick}>
      {props.value} 
    </button>
  )
};

class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    };
  
  render() { // render game squares 
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  } 
   
  } // Board END

class Game extends React.Component { // main game class
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O"; 
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  };
 
  boldBtn(btn) { // change fontWeight of clicked button
    let AllBtns = document.getElementsByClassName('btn')
    for (let i = 0; i < AllBtns.length; i ++) {
      AllBtns[i].style.fontWeight = 'normal'
    }
    btn.style.fontWeight = 'bold'
  };

  unSqrColor() { // change color of all squares if user back to previous move
    let allSqrs = document.getElementsByClassName('square')
    for (const simplsq of allSqrs) {
      simplsq.style.color = 'black'
    }
  }

  jumpTo(step, e) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
    let btn = e.target
    this.boldBtn(btn)
    this.unSqrColor()
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => { 
    const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className="btn" onClick={(e) => this.jumpTo(move, e)}>{desc}</button>
        </li>
      );
    });// end of moves
    
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (winner === null && moves.length === 10) {
      status = 'REMIS'
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
   
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}; // end of render

function calculateWinner(squares) { // Check for winning combination 
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) { 
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    let winComp = lines[i] 
    for (const num of winComp) {
      let sqrbtn = document.getElementsByClassName('square')
      sqrbtn[num].style.color = 'red'
    }
      return squares[a];
  }
  }
  return null;
};


ReactDOM.render(<Game />, document.getElementById("root"));

