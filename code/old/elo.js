const { getTournamentsData, getPlayerNameFromId } = require('../tournaments')

const Elo = async () => {
  let rows = await getTournamentsData();

  let points = {}
  for (let row of rows) {
    points[row.winner.id] = 100
    points[row.loser.id] = 100
  }

  for (let row of rows) {
    let score = row.score
    let delta = 0
    for (let set of score.sets) {
      let s = set.split('-');
      delta += parseInt(s[0]) - parseInt(s[1]);
    }
    if (score.length == 2) {
      points[row.winner.id] += 20
      points[row.loser.id] -= 20
    }
    if (score.length == 3) {
      points[row.winner.id] += 10
      points[row.loser.id] -= 10
    }
    points[row.winner.id] += delta;
    points[row.loser.id] -= delta;
  }

  let mx = -1;
  for (let player in points) {
    if (mx == -1) mx = player;
    if (points[player] > points[mx]) mx = player;
  }
  console.log(`player id ${mx} scores maximum of ${points[mx]}`);
  console.log(`player name ${await getPlayerNameFromId(mx)} scores maximum of ${points[mx]}`);
  
  var items = Object.keys(points).map(function(key) {
    return [key, points[key]];
  });
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  for (let point of items) {
    console.log(await getPlayerNameFromId(point[0]), point[1])
  }
}

Elo();