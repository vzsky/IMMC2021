const { Parse } = require('./parse')

const Filter = (rows) => {
  return rows.filter((r) => {
    if (r.year != '2012') return false;
    if (r.tournament == 'Australian Open') return true;
    if (r.tournament == 'Wimbledon') return true;
    if (r.tournament == 'US Open') return true;
    if (r.tournament == 'French Open') return true;
  })
}

const getPlayerNameFromId = async (id) => {
  let data = {}
  await Parse('data/players.csv', (row) => {
    data[row[0]] = row[1]+' '+row[2];
  });
  return data[id];
}

const tournamentsParser = (row) => ({
  loser: {
    id: row[6],
    name: row[8],
    rank: row[9],
    rankPoints: row[10],
    seed: row[11],
  },
  winner: {
    id: row[25],
    name: row[27],
    rank: row[28],
    rankPoints: row[29],
    seed: row[30],
  },
  year: row[31],
  tournament: row[20],
  score: parseScore(row[15], row[20], row[31]),
  round: row[14]
})

const parseScore = (score, tour, year) => {
  let sets = score.split(' ');

  let retired = false;
  let walkover = false;
  let winDefault = false;
  if (sets[sets.length-1] == 'RET') {
    retired = true;
    sets.pop()
  }
  if (sets[sets.length-1] == 'DEF') {
    winDefault = true;
    sets.pop()
  }
  if (sets[sets.length-1] == 'W/O') {
    walkover = true;
    sets.pop()
  }

  let tiebreak = sets.map((set) => {
    var match = /\(([^)]+)\)/.exec(set)
    if (match == null) return null
    return match[1]
  })

  sets = sets.map((set) => (
    set.replace(/ *\([^)]*\) */g, "")
  ))

  let sumWin = 0;
  let sumLose = 0;
  for (let set of sets) {
    sumWin += parseInt(set.split('-')[0])
    sumLose += parseInt(set.split('-')[1])
  }

  return {
    length: sets.length,
    sets,
    sumWin,
    sumLose,
    tiebreak,
    retired,
    walkover,
    winDefault
  }
}

const getTournamentsData = async () => {
  let rows = await Parse('data/matches.csv', tournamentsParser);
  rows = Filter(rows);
  return rows
}

module.exports = { getTournamentsData, tournamentsParser, getPlayerNameFromId }