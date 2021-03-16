const { Parse } = require('./parse')
// const { tournamentsParser } = require('./tournaments')
const { getTournamentsData } = require('./2018Tour')

const Test = async () => {
  let res = await getTournamentsData()
  console.log(res.length)
  console.log(res[0])
  console.log(res[1])
}

Test();