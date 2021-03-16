const {nCr, erfinv } = require('../../utils')

const championScore = (match) => 1000

const getRatingTourney = (tourney) => {
  let deg = {}
  let graph = {}
  let rating = {}

  for (let row of tourney) {
    graph[row.winner] = []
    graph[row.loser] = []
    deg[row.winner] = 0
    deg[row.loser] = 0
  }

  for (let row of tourney) {
    graph[row.winner].push(row);
    deg[row.loser] += 1
  }

  const illegalPlayer = []

  const DFS = (player) => {
    for (let row of graph[player]) {
      if (row.comment != null) {
        illegalPlayer.push(row.loser)
      }
      rating[row.loser] = adjustRating(row, rating[row.winner]);
      deg[row.loser] -= 1;
      if (deg[row.loser] == 0) DFS(row.loser);
    }
  }

  for (let player in deg) {
    if (deg[player] == 0) {
      rating[player] = championScore(tourney.length);
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

const SetToMatch = (p, bestOf) => {
  if (bestOf == 3) return p*p + 2*p*p*(1-p)
  if (bestOf == 5) return p*p*p + 3*p*p*p*(1-p) + 6*p*p*p*(1-p)*(1-p)
}

const getExpectedWinRatio = (row) => {
  let p = 0;
  let totalset = row.wonBy[0]+row.wonBy[1]
  for (let set = 1; set <= totalset; set++) {
    let win = row.winSets[set]
    let lose = row.loseSets[set]
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
  p /= totalset;
  
  if (row.comment != null) p=0.5

  return SetToMatch(GameToSet(p), row.bestOf)
}

module.exports = getRatingTourney