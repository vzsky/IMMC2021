const getData = require('./model/goat/getData')

const run = async () => {
  const player = 'Mirnyi M.'
  let data = await getData();
  for (let row of data) {
    if (row.winner == player || row.loser == player) {
      console.log(row)
    }
  }
}

run();