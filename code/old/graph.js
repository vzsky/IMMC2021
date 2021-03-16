const { getTournamentsData } = require('../tournaments')

const Graph = async () => {
  let rows = await getTournamentsData();
  let Graph = {}
  let degin = {}

  for (let row of rows) {
    Graph[row.winner.id] = []
    Graph[row.loser.id] = []
    degin[row.winner.id] = 0
    degin[row.loser.id] = 0
  }

  for (let row of rows) {
    Graph[row.winner.id].push(row.loser.id)
    degin[row.loser.id] += 1;
  }

  console.log(`There were ${Object.keys(Graph).length} players`)
  for (let player in Graph) {
    if (degin[player] == 0) console.log(`player id ${player} always win`)
  }
}

Graph();