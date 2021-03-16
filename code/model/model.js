// const { getTournamentsData, getPlayerNameFromId } = require('./tournaments')
const { getTournamentsData } = require('./2018Tour')
const { printSortedDict, nCr, erfinv } = require('./utils')

const Point = async () => {
  let data = await getTournamentsData();
  // const tours = ['Australian Open', 'Wimbledon', 'US Open', 'French Open']
  const tours = ['Australian Open', 'Wimbledon', 'US Open', 'Roland Garros']

  let annualPerformance = {}
  for (let tour of tours) {
    
    let rating = getRatingOfTourney(tour, data)
    
    for (let player in rating) {
      if (annualPerformance[player] == undefined) annualPerformance[player] = 0
      annualPerformance[player] += rating[player]
    }
  }

  printSortedDict(annualPerformance, (k)=>(k), null)
  return annualPerformance
}

const getRatingOfTourney = (tour, data) => {

  const Filter = (tour, data) => {
    return data.filter((r) => {
      if (r.tournament == tour) return true;
    })
  }

  let rows = Filter(tour, data);

  for (let row of rows) {
    const print = (row) => ({
      winner: row.winner.id,
      loser: row.loser.id,
      score: row.score.sets,
      special: row.score.retired | row.score.walkover | row.score.winDefault
    })
    if (row.loser.id == 'Naomi Osaka') console.log(print(row))
    if (row.loser.id == 'Simona Halep') console.log(print(row))
    if (row.loser.id == 'Kiki Bertens') console.log(print(row))
    if (row.loser.id == 'Angelique Kerber') console.log(print(row))
    if (row.loser.id == 'Caroline Wozniacki') console.log(print(row))
  }

  let deg = {}
  let graph = {}
  let rating = {}

  for (let row of rows) {
    graph[row.winner.id] = []
    graph[row.loser.id] = []
    deg[row.winner.id] = 0
    deg[row.loser.id] = 0
  }

  for (let row of rows) {
    graph[row.winner.id].push(row);
    deg[row.loser.id] += 1
  }

  const illegalPlayer = []

  const DFS = (player) => {
    for (let row of graph[player]) {
      if (row.score.retired || row.score.walkover || row.score.winDefault) {
        illegalPlayer.push(row.loser.id)
      }
      rating[row.loser.id] = adjustRating(row, rating[row.winner.id]);
      deg[row.loser.id] -= 1;
      if (deg[row.loser.id] == 0) DFS(row.loser.id);
    }
  }

  for (let player in deg) {
    if (deg[player] == 0) {
      rating[player] = 1000; // lower -> favor people who join less tournament
      DFS(player);
      break;
    }
  }

  for (let player of illegalPlayer) {
    rating[player] = 0;
  }

  return rating
}

const adjustRating = (row, winnerRating) => {
  let sigma = 1;
  let expectedWinRatio = getExpectedWinRatio(row)
  let deltaRating = 2 * sigma * erfinv(2*expectedWinRatio - 1);
  deltaRating = Math.max(Math.min(deltaRating, 140), -140)
  return winnerRating + deltaRating
}

const GameToSet = (p) => {
  let ans = 0;
  for (let i = 0; i <= 4; i++) {
    ans += nCr(5+i, i) * Math.pow(p, 6) * Math.pow(1-p, i);
  }
  ans += nCr(10, 5) * Math.pow(p, 7) * Math.pow(1-p, 5)
  ans += nCr(10, 5) * 2 * Math.pow(p, 7) * Math.pow(1-p, 6)

  return ans
}

const SetToMatch = (p) => {
  return p*p + 2*p*p*(1-p)
}


const getExpectedWinRatio = (row) => {
  let p = 0;
  for (let set of row.score.sets) {
    let win = set.split('-')[0]
    let lose = set.split('-')[1]
    if (win == 6 && lose < 5) {
      p += lose/(5+lose)
    }
    else if (lose == 6 && win < 5) {
      p += 5/(5+win)
    }
    else {
      p += 0.5
    }
  }
  p /= row.score.length;
  
  if (row.score.retired || row.score.winDefault || row.score.walkover) p=0.5

  return SetToMatch(GameToSet(p))
}

module.exports = Point

// Point();