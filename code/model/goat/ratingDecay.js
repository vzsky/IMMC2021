const { printSortedDict, unique } = require('../../utils')
const getTournamentsData = require('./getData')
const getRatingTourney = require('./getRatingTourney')

const splitTourney = async () => {
  const data = await getTournamentsData()
  let tournament = {}
  for (let i in data) {
    if (!tournament[`${data[i].year}-${data[i].atp}`]) tournament[`${data[i].year}-${data[i].atp}`] = []
    tournament[`${data[i].year}-${data[i].atp}`].push(data[i])
  }
  let tourneys = Object.keys(tournament).map((key) => {
    return tournament[key];
  })
  tourneys.sort((first, second) => (second[0] - first[0]));
  return tourneys
}

const ratingDecay = async () => {
  const lambda = 0.5

  const tourneys = await splitTourney()

  // console.log(tourneys)
  let nowScore = {}
  let mxScore = {}
  let i = 0
  for (let tourney of tourneys) {
    let rating = getRatingTourney(tourney)
    for (let player in rating) {
      if (nowScore[player] == undefined) nowScore[player] = 0
      nowScore[player] += rating[player]
    }
    if (i % 4 == 3) {
      console.log('year', i)
      await printSortedDict(nowScore, (k)=>(k), 6)
      for (let player in nowScore) {
        if (mxScore[player] == undefined) mxScore[player] = nowScore[player]
        mxScore[player] = Math.max(mxScore[player], nowScore[player])
      }
      for (let player in nowScore) {
        nowScore[player] *= lambda
      }
    }
    i += 1
  }

  for (let player in mxScore) {
    if (isNaN(mxScore[player])) mxScore[player] = -1
  }
  console.log('goat')
  await printSortedDict(mxScore, (k)=>(k), 6)
}

const run = () => {
  ratingDecay()
}
run()

module.exports = ratingDecay