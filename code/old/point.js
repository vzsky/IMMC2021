const { getTournamentsData, getPlayerNameFromId } = require('../tournaments')

const pointOf = {
  R128 : 10,
  R64 : 60,
  R32: 70,
  R16: 300,
  QF: 350,
  SF: 520,
  F: 700,
}

const Point = async () => {
  let rows = await getTournamentsData();
  let point = {}

  for (let row of rows) {
    point[row.winner.id] = 0
    point[row.loser.id] = 0
  }

  for (let row of rows) {
    point[row.winner.id] += pointOf[row.round]
  }

  let mxPlayer = 0
  for (let player in point) {
    if (point[player] > point[mxPlayer] || mxPlayer == 0) mxPlayer = player;
  }
  console.log(`player name ${await getPlayerNameFromId(mxPlayer)} scores maximum of ${point[mxPlayer]}`);
  
  var items = Object.keys(point).map(function(key) {
    return [key, point[key]];
  });
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  for (let point of items) {
    console.log(await getPlayerNameFromId(point[0]), point[1])
  }
}


Point();