const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

// /reading was last modified whenever the newest book was added
const csv = fs.readFileSync(path.join(__dirname, '../data/reading.csv'))
const latest = parse(csv, { delimiter: ',', from_line: 2 })
  .map((row) => row[0])
  .sort()
  .pop()

module.exports = {
  date: new Date(latest),
}
