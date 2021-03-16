const { Parse } = require('../../parse')

const tournamentsParser = (row) => ({
  atp: row[0],
  tourney: row[2],
  series: row[4],
  round: row[7],
  bestOf: row[8],
  winner: row[9],
  loser: row[10],
  wonBy: [row[23], row[24]],
  winSets: [row[13], row[15], row[17], row[19], row[21]],
  loseSets: [row[14], row[16], row[18], row[20], row[22]], 
  comment: parseComment(row[25]),
  year: row[3].split('/')[2]
})

const parseComment = (comment) => {
  if (comment == 'Walkover' || comment == 'Walover') return "W/O"
  if (comment == 'Retired' || comment == 'Retied' || comment == "retired") return "RET"
  if (comment == 'Disqualified') return "DQ"
  return null
}

const getTournamentsData = async () => {
  let data = await Parse('data/men.csv', tournamentsParser)
  data.shift()
  data = data.filter((val) => (val.series == 'Grand Slam'))
  return data
}

module.exports = getTournamentsData