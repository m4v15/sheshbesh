import React, { Component, Fragment } from 'react';
import './App.css';
import './grid.css';

import randomise, { totalDistance } from './logic.js'

const idMap = {
  1: 'col-1',
  2: 'col-2',
  3: 'col-3',
  4: 'col-4',
  5: 'col-5',
  6: 'col-6',
  7: 'col-8',
  8: 'col-9',
  9: 'col-10',
  10: 'col-11',
  11: 'col-12',
  12: 'col-13',
  13: 'col-13',
  14: 'col-12',
  15: 'col-11',
  16: 'col-10',
  17: 'col-9',
  18: 'col-8',
  19: 'col-6',
  20: 'col-5',
  21: 'col-4',
  22: 'col-3',
  23: 'col-2',
  24: 'col-1',
}

class App extends Component {

  // generatePieces = () => {
  //   let pieces = []
  //   for (let i = 1; i < 7; i++) {
  //     let colour = i % 2 === 0 ? "green" : "purple"
  //     pieces.push({ colour, col: `col-${i}`, row: `row-${i}` })
  //   }
  //   this.setState({ pieces })
  // }

  generateRandomBoard = () => {
    const { board: randomBoard, count } = randomise()

    this.setState({
      board: randomBoard,
      count
    })
  }

  state = {
    board: [],
    count: 0
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

  renderPieces = (spike) => {
    const { numberOfPieces, currentColour: colour } = spike
    if (numberOfPieces === 0) {
      return
    }
    let pieces = []
    let max = (numberOfPieces >= 6) ? 6 : numberOfPieces
    for (let i = 0; i < max; i++) {
      let text = (i === 0 && numberOfPieces > 6) ? numberOfPieces : ''
      pieces.push(<div className={`piece ${colour}`}>{text}</div>)
    }
    return pieces


  }

  renderStartingSetup = pieceArray => this.state.board.map(spike => {
    let pos = spike.id > 12 ? 'board-bottom' : 'board-top'
    return (<div className={`${pos} ${idMap[spike.id]} spike-area`}>
      {this.renderPieces(spike)}
    </div>)
  })

  handleClick = () => {
    this.generateRandomBoard()
  }

  componentWillMount() {
    this.generateRandomBoard()
  }

  render() {
    return (
      <Fragment>
        <div className={`page-container`}>
          <div className='home'>Green Home</div>
          <div className={`board-container`}>
            <div className="board back">
              {this.renderSpikes()}
              <div className="bar"></div>
            </div>
            <div className="board front">
              {this.renderStartingSetup()}
            </div>
          </div>
          <div className='home'>Purple Home</div>
          <div className='stats'>
            <div>Green pip count:{totalDistance(this.state.board, 'green')}</div>
            <div>Purple pip count:{totalDistance(this.state.board, 'purple')}</div>
          </div>
          <div class="button-container" onClick={this.handleClick}>
            <p class="button">Again!</p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
