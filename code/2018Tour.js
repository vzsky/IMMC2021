const { Parse } = require('./parse')

const Filter = (rows) => {
  return rows.filter((r) => {
    if (r.tournament == 'Australian Open') return true;
    if (r.tournament == 'Wimbledon') return true;
    if (r.tournament == 'US Open') return true;
    if (r.tournament == 'Roland Garros') return true;
  })
}

const tournamentsParser = (row) => ({
  loser: {
    id: row[18], // 15
    name: row[18],
  },
  winner: {
    id: row[10], // 7
    name: row[10],
  },
  year: 2018,
  tournament: row[1],
  score: parseScore(row[23]),
  round: row[25],
})

const parseScore = (score, name, n2) => {

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
  let rows = await Parse('data/2018.csv', tournamentsParser);
  rows = Filter(rows);
  return rows
}

module.exports = { getTournamentsData, tournamentsParser }