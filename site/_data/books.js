const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const flagsToEmoji = {
  'a': '🔈',
  'r': '🔁',
  'b': '📖',
}

// rows are [date, author, title, flags, [flag emojis]] — same shape the
// old express app handed to reading.html
module.exports = () => {
  const csv = fs.readFileSync(path.join(__dirname, '../../data/reading.csv'))
  return parse(csv, { delimiter: ',', from_line: 2 }).map((row) => [
    ...row,
    row[3].split('').map((flag) => flagsToEmoji[flag]),
  ])
}
