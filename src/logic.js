const makeBoard = () => {
  /*
  Initialise a board as an array of objects, each object representing a spike
  spike has 3 properties: id, currentColour, number of Pieces
  ID's are 1-24, with 1 top left and 24 bottom left
  Green pieces must travel to the top left, anti-clockwise 
  Purple pieces must travel to the bottom left, clockwise 
  */
  let board = []
  for (let i = 1; i <= 24; i++) {
    board.push({
      "id": i,
      "currentColour": null,
      "numberOfPieces": 0
    })
  }
  return board
}

const makePieces = () => {
  /*
  Initialise an array of piece objects, each object representing a piece
  spike has 1 property, colour. 15 with green and 15 with purple.
  This acts as a "bag" to pick from randomly
  */
  let pieces = []
  for (let i = 1; i <= 30; i++) {
    let colour = i % 2 === 0 ? "green" : "purple"
    pieces.push({ colour })
  }
  return pieces
}

const numericArray = n => {
  /*
  Make an array of numbers, 1 to n
  Utility function to help generate a list of 'allowed spikes' in the randomise function
  Allowed spikes are those which either have the same colour as the piece you are placing, or have no assigned colour
  */
  let numbers = []
  for (let i = 1; i <= n; i++) {
    numbers.push(i)
  }
  return numbers
}

const distanceHome = (colour, board) => spikeId => {
  /*
  How many steps a piece would have to travel to get chalked off
  Used to naively determine 'even-ness' of the board set up
  */
  const distance = (colour === 'green') ? spikeId : (board.length + 1 - spikeId)
  return distance
}


const totalDistance = (board, colour) => {
  /*
  Uses distanceHome to determine total steps needed for a particular colour for a given board
  */
  return board.reduce((count, spike) => {
    if (spike.currentColour === colour) {
      return count + distanceHome(colour, board)(spike.id) * spike.numberOfPieces
    }
    return count
  }, 0)
}

const inverseColour = colour => (colour === 'green') ? 'purple' : 'green'

const randomIndex = array => Math.floor(Math.random() * array.length)

const removeElement = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)]

const randomise = () => {
  /*
  Initialise a board and then randomly assign 30 pieces (15 green, 15 purple) to the spikes. Using total distance, only return when both colours have roughly the same total number of steps home (within 3)

  1. Initialise board, keep track of cycle number
  2. Initialise an array of pieces - our "bag" we pick from
  3. We want to keep track of the spikeId's that each colour "owns", so we can filter out the id's of the forbidden spikes later on - initially all spikes are available
  4. While we still have pieces in our bag, we should place them:
    a. Pick a random piece from our array, and get it's colour
    b. get the opposite colour as well
    c. get the a list of allowed spikes by filtering out any spikes already claimed by the other colour
      * if the current colout already has 6 spikes, it can only choose from those spikes
    d. get a random spike on our board from that list of allowed spikeIds
    e. Change colour and number of pieces properties on the spike as appropriate
    f. add the spike id to those belonging to this colour
    g. remove this piece from our piece "bag" array - this will mean if we get a load of the same colour in a row, it should normalise to then choosing the other colour
    h. loop until piece "bag" is empty
  5. Check the steps each colour needs to end - if it is too small start all over again.
  6. return and object containing the board, and the number of cycles it took to get there.

  */
  let board
  let stepDifference = 5
  let count = 0
  while (stepDifference > 3) {
    count++
    board = makeBoard()
    let pieces = makePieces()
    let colourSpikeIds = { green: [], purple: [] }
    let numOfRemainingPieces = pieces.length
    while (numOfRemainingPieces) {
      let randomPieceIndex = randomIndex(pieces)
      let randomPiece = pieces[randomPieceIndex]
      let pieceColour = randomPiece.colour
      let oppositeColour = inverseColour(pieceColour)
      let forbiddenSpikeIds = colourSpikeIds[oppositeColour]

      let currentColourSpikeIds = colourSpikeIds[pieceColour]

      let allowedSpikeIds = currentColourSpikeIds.length < 6
        ? numericArray(24).filter(number => {
          return !forbiddenSpikeIds.includes(number)
        })
        : currentColourSpikeIds

      let randomSpikeId = allowedSpikeIds[randomIndex(allowedSpikeIds)]

      const spike = board.find(spike => spike.id === randomSpikeId)
      spike.currentColour = pieceColour
      spike.numberOfPieces++

      colourSpikeIds[pieceColour].push(randomSpikeId)

      pieces = removeElement(pieces, randomPieceIndex)

      numOfRemainingPieces = pieces.length
    }
    stepDifference = Math.abs(totalDistance(board, 'green') - totalDistance(board, 'purple'))
  }
  return { board, count }
}

const { board: randomBoard, count } = randomise()






// BELOW IS CODE TO TRY THIS OUT
// 
// Uncomment the console logs to make some boards
// -------------------------------------
console.log(randomBoard)
console.log('Green steps needed: ', totalDistance(randomBoard, 'green'))
console.log('Purple steps needed: ', totalDistance(randomBoard, 'purple'))
console.log('Step Difference: ', totalDistance(randomBoard, 'green') - totalDistance(randomBoard, 'purple'))
console.log('Cycles needed: ', count)


// BELOW IS A FUNCTION TO TEST WE ARE ADDING CORRECT NUMBER OF PIECES 
// 
// Did not have wifi so just had to check
// -------------------------------------
// const totalPieces = (board, colour) => {
//     return board.reduce((count, spike) => {
//       if (colour && spike.currentColour !== colour) {
//         return count
//       }
//       return count + spike.numberOfPieces
//     }, 0)
//   }


// BELOW IS TESTS FOR THE DISTANCE HOME
// 
// Did not have wifi so just had to check
// -------------------------------------
// const testCase = [{ id: 1, currentColour: 'green', numberOfPieces: 1 },
// { id: 2, currentColour: 'purple', numberOfPieces: 1 },
// { id: 3, currentColour: 'green', numberOfPieces: 2 },
// { id: 4, currentColour: 'green', numberOfPieces: 1 }]

// console.log('Green steps needed: ', totalDistance(testCase, 'green'))
// console.log('Purple steps needed: ', totalDistance(testCase, 'purple'))
// console.log('Green correct: ', (totalDistance(testCase, 'green') === 11))
// console.log('Purple correct: ', (totalDistance(testCase, 'purple') === 3))


// export default makeBoard