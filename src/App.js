import React, { Component, Fragment } from 'react';
import './App.css';
import './grid.css';

class App extends Component {

  generatePieces = () => {
    let pieces = []
    for (let i = 1; i < 7; i++) {
      let colour = i % 2 === 0 ? "green" : "purple"
      pieces.push({ colour, col: `col-${i}`, row: `row-${i}` })
    }
    this.setState({ pieces })
  }

  state = {
    pieces: []
  }

  renderSpikes = () => {
    let spikes = []
    for (let i = 1; i <= 24; i++) {
      let colour = i % 2 === 0 ? 'black' : 'red'
      let pos = i > 12 ? 'spike-bottom' : 'spike-top'
      spikes.push(<div className={`${pos} ${colour}`}></div>)
    }
    return spikes
  }

  renderPieces = pieceArray => pieceArray.map(piece => {
    return <div className={`piece ${piece.colour} ${piece.col} ${piece.row}`}></ div>
  })

  componentWillMount() {
    this.generatePieces()
  }

  render() {
    return (
      <Fragment>
        <div className="board back">
          {this.renderSpikes()}
          <div className="bar"></div>
        </div>
        <div className="board front">
          {this.renderPieces(this.state.pieces)}
        </div>
      </Fragment>
    );
  }
}

export default App;
