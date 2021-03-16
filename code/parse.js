const fs = require('fs');
const CsvReadableStream = require('csv-reader');

const Parse = (path, func) => {
  let inputStream = fs.createReadStream(path, 'utf8');
  return new Promise((resolve) => {
    let rows = []
    inputStream
      .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', (row) => {
        rows.push(func(row))
      })
      .on('end', function () {
        resolve(rows)
      });
  })
}

module.exports = {
  Parse,
};